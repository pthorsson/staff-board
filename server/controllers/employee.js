'use strict';

const store = require('../store');

// - Employee controller

module.exports = {

    get: [
        (req, res, next) => {
            let result = store.employee.get(req.params.eid);

            res.status(result.code).json(result.data);
        },
    ],

    getAll: [
        (req, res, next) => {
            let result = store.employee.getAll();

            res.status(result.code).json(result.data);
        },
    ],

    create: [
        (req, res, next) => {
            let employee = {},
                data = req.body;

            employee.firstName = data.firstName;
            employee.lastName = data.lastName;

            let result = store.employee.add(employee);

            res.status(result.code).json(result.data);
        },
    ],

    edit: [
        (req, res, next) => {
            let result = store.employee.update(req.params.eid, req.body);

            res.status(result.code).json(result.data);
        },
    ],

    delete: [
        (req, res, next) => {
            let result = store.employee.remove(req.params.eid);

            res.status(result.code).json(result.data);
        },
    ],

};
