var config = require('./db-config.js'),
        bus = require('hermes-bus'),
        db = require('riak-js').getClient({host: config.host, port: config.port});

bus.onEvent("storePathNUpdateUI", function(path) {
    db.get("abc-fs", "registered-paths", function(error, registeredPaths) {
        if (registeredPaths.indexOf(path) === -1) {
            registeredPaths.push(path);
            db.save("abc-fs", "registered-paths", registeredPaths);
        }
            bus.socket.emitUIEvent({event: "register-path", path: path});
    });
}).registerLocation(__filename);

bus.onEvent("deletePath", function(path) {
    db.get("abc-fs", "registered-paths", function(error, registeredPaths) {
        var index = registeredPaths.indexOf(path);
        registeredPaths.splice(index, 1);
        db.save("abc-fs", "registered-paths", registeredPaths);
    });
}).registerLocation(__filename);

module.exports = db;