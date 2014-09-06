var config = require('./db-config.js'),
        bus = require('hermes-bus'),
        db = require('riak-js').getClient({host: config.host, port: config.port});

var pathsStoreObject = {
    bucket: "abc-fs",
    key: "registered-paths",
    initialValue: []
};

bus.onEvent("storePath", function(path) {
    db.get(pathsStoreObject.bucket, pathsStoreObject.key, function(error, registeredPaths) {
        if (registeredPaths.indexOf(path) === -1) {
            registeredPaths.push(path);
            db.save(pathsStoreObject.bucket, pathsStoreObject.key, registeredPaths);
        }
    });
}).registerLocation(__filename);

bus.onEvent("deletePath", function(path) {
    db.get(pathsStoreObject.bucket, pathsStoreObject.key, function(error, registeredPaths) {
        var index = registeredPaths.indexOf(path);
        registeredPaths.splice(index, 1);
        db.save(pathsStoreObject.bucket, pathsStoreObject.key, registeredPaths);
    });
}).registerLocation(__filename);

bus.onEvent("initializeFields", function(action) {
    var fields = [pathsStoreObject];
    fields.forEach(function(field) {
        createField(field.bucket, field.key, field.initialValue);
    })
});

bus.onEvent("onDataGet", function(action) {
    db.get(action.bucket, action.key, function(error, data) {
        action.cb(data);
    });
});

function createField(bucket, key, initialValue) {
    db.exists(bucket, key, function(error, exists) {
        if (!exists) {
            db.save(bucket, key, initialValue);
        }
    });
}

module.exports = db;