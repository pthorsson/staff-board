'use strict';

const controller = {
    employee: require('./controllers/employee'),
    message: require('./controllers/message'),
    docs: require('./controllers/docs')
};

module.exports = app => {

    // ---- API - Employee ----
    app.post('/api/employee', controller.employee.create);
    app.put('/api/employee/:eid', controller.employee.edit);
    app.get('/api/employee/:eid', controller.employee.get);
    app.get('/api/employees', controller.employee.getAll);
    app.delete('/api/employee/:eid', controller.employee.delete);

    if (process.env.ENV !== 'prod') {
        app.delete('/api/employees/reset', controller.employee.reset);
    }

    // ---- API - Message ----
    app.post('/api/message', controller.message.create);
    app.put('/api/message/:mid', controller.message.edit);
    app.get('/api/message/:mid', controller.message.get);
    app.get('/api/messages', controller.message.getAll);
    app.get('/api/messages/batched', controller.message.getBatched);
    app.delete('/api/message/:mid', controller.message.delete);

    // ---- API - Catch bad request ----
    app.use('/api/*', (req, res) => res.status(400).json('Bad request'));


    if (process.env.ENV !== 'prod') {

        // ---- Docs page ----
        app.get('/docs/:page?', controller.docs);

    }

};
