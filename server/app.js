'use strict';

const path = require('path');
const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const compression = require('compression');
const io = require('socket.io')(server);
const scheduler = require('node-schedule');
const store = require('./store');

module.exports = config => {

    // Initiates store
    store.init(config.database);
    store.cleanUp();

    // Preforms a store clean up 00:01 every day, removing all expired messages.
    if (config.scheduleCleanUp) {
        scheduler.scheduleJob('1 0 * * *', store.cleanUp);
    }

    // Serves client dist folder as static root
    if (config.serveClient) {
        app.use(express.static(path.join(__dirname, '../client/dist')));
    }

    // Subscribes to store to emit changes to all sockets.
    store.subscribe(() => io.sockets.emit('state', store.message.getBatched().data));

    // Emits messages on socket connection
    io.on('connection', socket => socket.emit('state', store.message.getBatched().data));

    // Pre endpoint middleware
    app.use(compression());
    app.use(bodyParser.json());
    app.use(cors());

    // Set endpoints
    require('./endpoints')(app, config);

    // Start app
    let port = config.port;

    console.log(`Server listening on ${port}`);
    return server.listen(port);
    
};
