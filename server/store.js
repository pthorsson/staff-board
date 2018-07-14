'use strict';

const fs = require('fs');
const _ = require('lodash');
const uuid = require('uuid/v1');

let storeData = {
    employees: [],
    messages: []
};

const store = {

    dbFile: null,

    init(dbFile) {
        store.dbFile = dbFile;

        try {
            let dataJson = fs.readFileSync(store.dbFile, 'utf8');

            storeData = JSON.parse(dataJson);
        } catch(err) {
            saveData();
        }
    },

    employee: {

        get(id) {
            let employee = findEmployee(id);

            return employee ? _.clone(employee) : null;
        },

        getAll() {
            return _.cloneDeep(storeData.employees);
        },
    
        add(data, cb) {
            let id, employee = {};

            if (findEmployee(`${data.firstName} ${data.lastName}`)) {
                return cb('Employee already exists');
            }

            while (!id || findEmployee(id)) {
                id = uuid();
            }

            employee.id = id;
            employee.firstName = data.firstName;
            employee.lastName = data.lastName;

            storeData.employees.push(employee);

            saveData();

            cb(null);
        },

        update(id, data) {
            let employee = findEmployee(id);

            if (!employee) return false;

            employee.firstName = data.firstName || employee.firstName;
            employee.lastName  = data.lastName  || employee.lastName;

            saveData();

            return true;
        },

        remove(id) {
            _.remove(storeData.employees, employee => {
                if (employee.id === id || `${employee.firstName} ${employee.lastName}` === id) {
                    _.remove(storeData.messages, message => message.employee === employee.id);
                    return true;
                }
            });

            saveData();
        }

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
                let employee = _.clone(employee),
                    messages = _.filter(storeData.message, { employee: employee.id });

                if (message.length) {
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

        update(id, data) {
            let message = _.find(storeData.messages, { id });

            if (!message) return false;

            employee.firstName = data.firstName || employee.firstName;
            employee.lastName  = data.lastName  || employee.lastName;

            saveData();

            return true;
        },

        remove(id) {
            _.remove(storeData.messages, message => message.employee === id);
        }

    }

};

/**
 * Searches for employee by id or firstName+lastName
 * @param {*} id 
 */
const findEmployee = (id) => {
    let uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

    if (uuidPattern.test(id)) {
        return _.find(storeData.employees, employee => employee.id === id);
    } else {
        return _.find(storeData.employees, employee => `${employee.firstName} ${employee.lastName}` === id);
    }
};

/**
 * Writes the storeData object to the specified dbFile.
 */
const saveData = () => {
    let fileData = JSON.stringify(storeData, null, 4);

    try {
        fs.writeFileSync(store.dbFile, fileData);
    } catch(err) {}
};

module.exports = store;
