var config = require('./db-config.js'),
        bus = require('hermes-bus'),
        db = require('riak-js').getClient({host: config.host, port: config.port});



bus.onEvent(this, "store-path-n-update-ui", function(path) {
    db.get("abc-fs", "registered-paths", function(error, registeredPaths) {
        if (registeredPaths.indexOf(path) === -1) {
            registeredPaths.push(path);
            db.save("abc-fs", "registered-paths", registeredPaths);
            bus.emit('socket-ui-event', {event: "register-path", path: path});
        }
    });
});

bus.onEvent(this, "path-delete", function(path) {
    db.get("abc-fs", "registered-paths", function(error, registeredPaths) {
        var index = registeredPaths.indexOf(path);
        registeredPaths.splice(index, 1);
        db.save("abc-fs", "registered-paths", registeredPaths);
    });
});




module.exports = db;