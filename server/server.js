'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const compression = require('compression');
const io = require('socket.io')(server);
const scheduler = require('node-schedule');
const store = require('./store');

// Initiates store
store.init('../db.json');
store.cleanUp();

// Preforms a store clean up 00:01 every day, removing all expired messages.
scheduler.scheduleJob('1 0 * * *', store.cleanUp);

// Subscribes to store to emit changes to all sockets.
store.subscribe(() => io.sockets.emit('state', store.message.getBatched()));

// Emits messages on socket connection
io.on('connection', socket => socket.emit('state', store.message.getBatched()));

// Pre endpoint middleware
app.use(compression());
app.use(bodyParser.json());

// Set endpoints
require('./endpoints')(app);

// Start app
let port = 9000;

server.listen(port);
console.log(`Server listening on ${port}`);
