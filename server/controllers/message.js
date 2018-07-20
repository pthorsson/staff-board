'use strict';

const store = require('../store');

// - Message controller

module.exports = {

    get: [
        (req, res, next) => {
            let result = store.message.get(req.params.mid);

            res.status(result.code).json(result.data);
        },
    ],

    getAll: [
        (req, res, next) => {
            let result = store.message.getAll();

            res.status(result.code).json(result.data);
        },
    ],

    getBatched: [
        (req, res, next) => {
            let result = store.message.getBatched();

            res.status(result.code).json(result.data);
        },
    ],

    create: [
        (req, res, next) => {
            let message = {},
                data = req.body;

            message.employee = data.employee;
            message.message = data.message;
            message.expiresAt = data.expiresAt;

            let result = store.message.add(message);

            res.status(result.code).json(result.data);
        },
    ],

    edit: [
        (req, res, next) => {
            let result = store.message.update(req.params.mid, req.body);

            res.status(result.code).json(result.data);
        },
    ],

    delete: [
        (req, res, next) => {
            let result = store.message.remove(req.params.mid);

            res.status(result.code).json(result.data);
        },
    ],

};
