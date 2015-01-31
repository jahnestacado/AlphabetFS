var bus = require('hermes-bus');

bus.subscribeEventsFrom(
        './src/core/statusBallBlinkHandler.js',
        './src/db/db-utils.js',
        './src/core/dirTracker',
        './src/core/mover.js',
        './src/core/activateDirectory',
        './src/express/server.js'
        );