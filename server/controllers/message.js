'use strict';

const store = require('../store');

// - Message controller

module.exports = {

    get: [
        (req, res, next) => {
            store.message
                .get(req.params.mid)
                .then(message => res.status(200).json(message), err => res.status(err.code).json(err.message));
        },
    ],

    getAll: [
        (req, res, next) => {
            store.message
                .getAll()
                .then(messages => res.status(200).json(messages));
        },
    ],

    getBatched: [
        (req, res, next) => {
            store.message
                .getBatched()
                .then(messages => res.status(200).json(messages));
        },
    ],

    create: [
        (req, res, next) => {
            let message = {},
                data = req.body;

            message.employee = data.employee;
            message.message = data.message;
            message.expiresAt = data.expiresAt;

            store.message
                .add(message)
                .then(message => res.status(200).json(message), err => res.status(err.code).json(err.message));
        },
    ],

    edit: [
        (req, res, next) => {
            store.message
                .update(req.params.mid, req.body)
                .then(() => res.status(200).json('OK'), err => res.status(err.code).json(err.message));
        },
    ],

    delete: [
        (req, res, next) => {
            let messageId = req.params.eid;

            store.message
                .remove(req.params.eid)
                .then(() => res.status(200).json('OK'), err => res.status(err.code).json(err.message));
        
        },
    ],

};
