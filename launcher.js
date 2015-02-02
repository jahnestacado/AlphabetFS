var bus = require('hermes-bus');

bus.subscribeEventsFrom(
        './src/core/state-handler.js',
        './src/db/db-utils.js',
        './src/core/dirTracker',
        './src/core/archiver.js',
        './src/core/activateDirectory',
        './src/express/server.js'
        );