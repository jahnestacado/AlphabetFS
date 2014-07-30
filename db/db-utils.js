var config = require('./db-config.js'),
        db = require('riak-js').getClient({host: config.host, port: config.port});

module.exports = db;