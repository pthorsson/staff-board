'use strict';

const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid/v1');

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
     *
     *
     * @param {function} cb Callback function.
     */
    subscribe(cb) {
        if (typeof cb === 'function') {
            subscriptions.push(cb);
            cb();
        }
    },

    employee: {

        /**
         * Fetches employee data from the store data by employee id.
         * 
         * @param {string} id Employee id.
         * 
         * @return {Promise} 
         */
        get: (id) => new Promise((resolve, reject) => {
            let employee = findEmployee(id);
            
            if (employee) {
                resolve(_.clone(employee));
            } else {
                reject('Employee not found');
            }
        }),

        /**
         * Fetches employee data from the store data for all employees.
         * 
         * @return {Promise} 
         */
        getAll: () => new Promise((resolve, reject) => {
            resolve(_.cloneDeep(storeData.employees))
        }),
        
        /**
         * Creates an employee.
         * 
         * @param {any} data Data containing first and last name of new employee.
         * 
         * @return {Promise} 
         */
        add: (data) => new Promise((resolve, reject) => {
            let id, employee = {};

            if (findEmployee(data.firstName + data.lastName)) {
                return reject('Employee already exists');
            }

            while (!id || findEmployee(id)) {
                id = uuid();
            }

            employee.id = id;
            employee.firstName = data.firstName;
            employee.lastName = data.lastName;

            storeData.employees.push(employee);

            saveData();
            resolve(_.clone(employee));
        }),

        /**
         * Updates employee data by employee id.
         * 
         * @param {string} id   Employee id.
         * @param {any}    data New employee data.
         * 
         * @return {Promise} 
         */
        update: (id, data) => new Promise((resolve, reject) => {
            let employee = findEmployee(id);

            if (!employee) {
                return reject('Employee not found');
            }

            employee.firstName = data.firstName || employee.firstName;
            employee.lastName  = data.lastName  || employee.lastName;

            saveData();
            resolve(_.clone(employee));
        }),

        /**
         * Removes an employee by id along with all the messages connected
         * to the given employee.
         * 
         * @param {string} id Employee id.
         * 
         * @return {Promise} 
         */
        remove: (id) => new Promise((resolve, reject) => {
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
                resolve();
            } else {
                reject('Not found');
            }
        }),

    },

    message: {

        get(id) {
            let message = _.find(storeData.messages, { id });

            return message ? _.clone(message) : null;
        },

        getAll() {
            return _.cloneDeep(storeData.messages);
        },

        getBatched() {
            let batchedMessages = [];

            _.forEach(storeData.employees, _employee => {
                let employee = _.clone(_employee),
                    messages = _.filter(storeData.message, { employee: employee.id });

                if (messages.length) {
                    employee.messages = messages;
                    batchedMessages.push(employee);
                }
            });

            return batchedMessages;
        },

        add(employeeId, data, cb) {
            let id, message = {};

            if (!findEmployee(employeeId)) {
                return cb('No employee with the given id');
            }

            while (!id || _.find(storeData.messages, { id })) {
                id = uuid();
            }

            message.id = id;
            message.employee = employeeId;
            message.message = data.message;
            message.expiresAt = data.expiresAt;

            storeData.messages.push(message);

            saveDate();

            cb(null);
        },

        update(id, data, cb) {
            let message = _.find(storeData.messages, { id });

            if (!message) return cb('Message not found');

            employee.firstName = data.firstName || employee.firstName;
            employee.lastName  = data.lastName  || employee.lastName;

            saveData();

            cb(null);
        },

        remove(id) {
            _.remove(storeData.messages, message => message.employee === id);

            saveData();
        }

    }

};

/**
 * Searches for employee by id or firstName+lastName
 * @param {*} id 
 */
const findEmployee = (id) => {
    let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        findById = employee => id === employee.id,
        findByName = employee => id.replace('+', '').toLowerCase() === (employee.firstName + employee.lastName).toLowerCase();

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

module.exports = store;
