var pathGatherer = require('./core/pathGatherer.js')
        , mover = require('./core/mover.js')
        , alphabetDirectories = require('./core/alphabetDirectories')
        , express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , bus = require('hermes-bus')
        , db = require('riak-js').getClient({host: "127.0.0.1", port: "8098"});


server.listen(8085);

var registeredDirs = [];
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    console.log("OnConnection ");

    init(socket);

    socket.on('path-entry', function(targetDirPath) {
        if (registeredDirs.indexOf(targetDirPath) === -1) {
            activateDir(targetDirPath);
        }
    });


    bus.onEvent(this, "socket-ui-event", function(data) {
        socket.emit(data.event, data.path);
    });

});


function activateDir(targetDirPath) {
    registeredDirs.push(targetDirPath);
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content);
}


function init(socket) {
    db.exists("abc-fs", "registered-paths", function(err, data) {
        if (data) {
            db.get("abc-fs", "registered-paths", function(error, data) {
                if (registeredDirs !== data) {
                    registeredDirs = data;
                    var newPaths = data.filter(function(i) {
                        return registeredDirs.indexOf(i) < 0;
                    });
                    newPaths.forEach(function(path) {
                        activateDir(path);
                        socket.emit("path-entry", path);
                    });
                }
                socket.emit('init', data);
            }
            );
        } else {
            db.save("abc-fs", "registered-paths", []);
        }
    });
}


