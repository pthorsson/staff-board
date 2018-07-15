'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const store = require('./store');

// Initiates store
store.init('../db.json');

store.subscribe(() => {
    store.message
        .getBatched()
        .then(messages => {
            // console.log(JSON.stringify(messages));
        });
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
