'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const compression = require('compression');
const store = require('./store');

// Initiates store
store.init('../db.json');

// Pre endpoint middleware
app.use(compression());
app.use(bodyParser.json());

// Set endpoints
require('./endpoints')(app);

// Start app
app.listen(config.port);
console.log(`Server listening on ${config.port}`);
