var bus = require('hermes-bus');

bus.subscribeEventsFrom(
        './db/db-utils.js',
        './core/activateDirectory',
        './express/server.js'
        );
