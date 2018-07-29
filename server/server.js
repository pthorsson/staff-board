'use strict';

const app = require('./app');

app({
    database: '../db.json',
    port: 9000,
    scheduleCleanUp: true,
    serveClient: true
});
