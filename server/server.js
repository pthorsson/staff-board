'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const scheduler = require('node-schedule');
const store = require('./store');

// Initiates store
store.init('../db.json');
store.cleanUp();

// Preforms a store clean up 00:01 every day, removing all expired messages.
scheduler.scheduleJob('1 0 * * *', store.cleanUp);

store.subscribe(() => {
    let messages = store.message.getBatched();
});

// Pre endpoint middleware
// app.use(compression());
app.use(bodyParser.json());

// Set endpoints
require('./endpoints')(app);

// Start app
let port = 9000;

app.listen(port);
console.log(`Server listening on ${port}`);
