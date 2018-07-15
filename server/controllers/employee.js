'use strict';

const store = require('../store');

// - Employee controller

module.exports = {

    get: [
        (req, res, next) => {
            store.employee
                .get(req.params.eid)
                .then(employee => res.status(200).json(employee), err => res.status(err.code).json(err.message));
        },
    ],

    getAll: [
        (req, res, next) => {
            store.employee
                .getAll()
                .then(employees => res.status(200).json(employees));
        },
    ],

    create: [
        (req, res, next) => {
            let employee = {},
                data = req.body;

            employee.firstName = data.firstName;
            employee.lastName = data.lastName;

            store.employee
                .add(employee)
                .then(employeeId => res.status(200).json(employeeId), err => res.status(err.code).json(err.message));
        },
    ],

    edit: [
        (req, res, next) => {
            store.employee
                .update(req.params.eid, req.body)
                .then(() => res.status(200).json('OK'), err => res.status(err.code).json(err.message));
        },
    ],

    delete: [
        (req, res, next) => {
            let employeeId = req.params.eid;

            store.employee
                .remove(req.params.eid)
                .then(() => res.status(200).json('OK'), err => res.status(err.code).json(err.message));
        
        },
    ],

};
