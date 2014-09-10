var bus = require('hermes-bus');

bus.subscribeEventsFrom(
        './core/statusBallBlinkHandler.js',
        './db/db-utils.js',
        './core/activateDirectory',
        './express/server.js'
        );