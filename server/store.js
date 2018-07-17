'use strict';

const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid/v1');

// Misc
const datePattern = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;

// Store data.
let storeData = {
    employees: [],
    messages: []
};

// Callbacks for subscriptions.
let subscriptions = [];

const store = {

    // Path to database file.
    dbFile: null,

    /**
     * Initiates the store by reading or creating the database json
     * and emitting the data.
     *
     * @param {string} dbFile Path to database file.
     */
    init(dbFile) {
        store.dbFile = dbFile;

        try {
            let dataJson = fs.readFileSync(store.dbFile, 'utf8');

            storeData = JSON.parse(dataJson);
            store.emit();
        } catch(err) {
            saveData();
        }
    },

    /**
     * Executes subscription callbacks.
     */
    emit() {
        _.forEach(subscriptions, cb => cb());
    },

    /**
     * Subscribes to changes in the store data.
     *
     * @param {function} cb Callback function.
     */
    subscribe(cb) {
        if (typeof cb === 'function') {
            subscriptions.push(cb);
            cb();
        }
    },

    /**
     * Resets store data to initial state and saves the data.
     */
    reset() {
        storeData.employees.length = 0;
        storeData.messages.length = 0;

        saveData();
    },

    /**
     * Removed any expired messages.
     */
    cleanUp() {
        _.remove(storeData.messages, message => {
            let expiresAt, now;

            if (!datePattern.test(message.expiresAt)) {
                return true;
            }

            expiresAt = new Date(message.expiresAt);
            now = new Date();

            return expiresAt <= now;
        });

        saveData();
    },

    employee: {

        /**
         * Fetches employee data from the store data by employee id.
         * 
         * @param {string} id Employee id.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        get(id) {
            let employee = findEmployee(id);
            
            if (employee) {
                return { code: 200, data: _.clone(employee) };
            } else {
                return { code: 404, data: 'Employee not found' };
            }
        },

        /**
         * Fetches employee data from the store data for all employees.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        getAll() {
            return { code: 200, data: _.cloneDeep(storeData.employees) };
        },
        
        /**
         * Creates an employee.
         * 
         * @param {any} data Data containing first and last name of new employee.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        add(data) {
            let id, employee = {};

            if (findEmployee(data.firstName + data.lastName)) {
                return { code: 400, data: 'Employee already exists' };
            }

            while (!id || findEmployee(id)) {
                id = uuid();
            }

            employee.id = id;
            employee.firstName = data.firstName;
            employee.lastName = data.lastName;

            storeData.employees.push(employee);

            saveData();

            return { code: 200, data: employee.id };
        },

        /**
         * Updates employee data by employee id.
         * 
         * @param {string} id   Employee id.
         * @param {any}    data New employee data.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        update(id, data) {
            let employee = findEmployee(id);

            if (!employee) {
                return { code: 404, data: 'Employee not found' };
            }

            employee.firstName = data.firstName || employee.firstName;
            employee.lastName  = data.lastName  || employee.lastName;

            saveData();
            
            return { code: 200, data: 'OK' };
        },

        /**
         * Removes an employee by id along with all the messages connected
         * to the given employee.
         * 
         * @param {string} id Employee id.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        remove(id) {
            let employeeFound = false;

            _.remove(storeData.employees, employee => {
                if (employee.id === id || employee.firstName + employee.lastName === id) {
                    _.remove(storeData.messages, message => message.employee === employee.id);
                    employeeFound = true;
                    return true;
                }
            });
            
            if (employeeFound) {
                saveData();

                return { code: 200, data: 'OK' };
            } else {
                return { code: 404, data: 'Employee not found' };
            }
        },

    },

    message: {

        /**
         * Fetches message data from the store data by message id.
         * 
         * @param {string} id Message id.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        get(id) {
            let message = _.find(storeData.messages, { id });
            
            if (message) {
                return { code: 200, data: _.clone(message) };
            } else {
                return { code: 404, data: 'Message not found' };
            }
        },

        /**
         * Fetches all messages from the store data.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        getAll() {
            return { code: 200, data: _.cloneDeep(storeData.messages) };
        },

        /**
         * Fetches all messages batched together with the related employee.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        getBatched() {
            let batchedMessages = [];

            _.forEach(storeData.employees, _employee => {
                let employee = _.clone(_employee),
                    messages = _.filter(storeData.messages, { employee: _employee.id });

                if (messages.length) {
                    employee.messages = messages;
                    batchedMessages.push(employee);
                }
            });

            return { code: 200, data: batchedMessages };
        },

        /**
         * Creates a message.
         * 
         * @param {string} employeeId Employee id.
         * @param {any}    data       Message and expiration date.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        add(data) {
            let id,
                message = {},
                employee = findEmployee(data.employee);

            if (!employee) {
                return { code: 400, data: 'No employee with the given id' };
            }

            if (typeof data.expiresAt !== 'undefined' && !validateDate(data.expiresAt)) {
                return { code: 400, data: 'Invalid expiration date' };
            }

            while (!id || _.find(storeData.messages, { id })) {
                id = uuid();
            }

            message.id = id;
            message.employee = employee.id;
            message.message = data.message;
            message.expiresAt = data.expiresAt;

            storeData.messages.push(message);

            saveData();

            return { code: 200, data: message.id };
        },

        /**
         * Updates message data by message id.
         * 
         * @param {string} id   Message id.
         * @param {any}    data New employee data.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        update(id, data) {
            let message = _.find(storeData.messages, { id });

            if (!message) {
                return { code: 404, data: 'Message not found' };
            }

            if (typeof data.expiresAt !== 'undefined' && !validateDate(data.expiresAt)) {
                return { code: 400, data: 'Invalid expiration date' };
            }

            message.message   = data.message   || message.message;
            message.expiresAt = data.expiresAt || message.expiresAt;

            saveData();

            return { code: 200, data: 'OK' };
        },

        /**
         * Removes a message.
         * 
         * @param {string} id Message id.
         * 
         * @returns {any} Results: { code: number, data: any }
         */
        remove(id) {
            if (!_.find(storeData.messages, { id })) {
                return { code: 404, data: 'Message not found' };
            }

            _.remove(storeData.messages, message => message.employee === id);

            saveData();
            
            return { code: 200, data: 'OK' };
        },

    }

};

/**
 * Searches for employee by id or firstName+lastName
 * 
 * @param {string} id 
 * 
 * @returns {any} Either employee data or null.
 */
const findEmployee = (id) => {
    let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        findById = employee => id === employee.id,
        findByName = employee => typeof id === 'string' && id.replace('+', '').toLowerCase() === (employee.firstName + employee.lastName).toLowerCase();

    return _.find(storeData.employees, uuidPattern.test(id) ? findById : findByName);
};

/**
 * Writes the storeData object to the specified dbFile.
 */
const saveData = () => {
    let fileData = JSON.stringify(storeData, null, 4);

    try {
        fs.writeFileSync(store.dbFile, fileData);
        store.emit();
    } catch(err) {}
};

/**
 * Validate a date string.
 * 
 * @param {*} date 
 * 
 * @return {boolean} If date is valid or not
 */
const validateDate = (date) => datePattern.test(date) && new Date(date);

module.exports = store;
