var pathGatherer = require('./core/pathGatherer.js')
        , mover = require('./core/mover.js')
        , alphabetDirectories = require('./core/alphabetDirectories')
        , express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , bus = require('hermes-bus')
        , db = require('./db/db-utils.js');


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

    socket.on('path-delete', function(path) {
        bus.emitDeletePath(path);
    });


    bus.onEvent("#socket-UIEvent", function(data) {
        socket.emit(data.event, data.path);
    }).registerLocation(__filename);

});

function activateDir(targetDirPath) {
    registeredDirs.push(targetDirPath);
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content, mover.moveToAlphabetDirs);
}

bus.onEvent('deletePath', function(path) {
    var index = registeredDirs.indexOf(path);
    registeredDirs.splice(index, 1);
}).registerLocation(__filename);

function init(socket) {
    db.exists("abc-fs", "registered-paths", function(error, data) {
        if (data) {
            db.get("abc-fs", "registered-paths", function(error, data) {
                if (registeredDirs.length === 0) {
                    data.forEach(function(path) {
                    socket.emit("path-entry", path);
                    });
                } else {
                    socket.emit('init', data);
                }
            }
            );
        } else {
            db.save("abc-fs", "registered-paths", []);
        }
    });
}


