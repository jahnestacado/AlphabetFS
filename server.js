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

var activeDirectories = [];
app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));


bus.emitInitializeFields();

io.sockets.on('connection', function(socket) {
    console.log("OnConnection ");

    init(socket);

    socket.on('path-entry', function(targetDirPath) {
        if (activeDirectories.indexOf(targetDirPath) === -1) {
            activateDir(targetDirPath);
        }
    });

    socket.on('path-delete', function(path) {
        bus.emitDeletePath(path);
    });


    bus.onEvent("socket","UIEvent", function(data) {
        socket.emit(data.event, data.path);
    }).registerLocation(__filename);

});

function activateDir(targetDirPath) {
    activeDirectories.push(targetDirPath);
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content, mover.moveToAlphabetDirs);
}

bus.onEvent('deletePath', function(path) {
    var index = activeDirectories.indexOf(path);
    activeDirectories.splice(index, 1);
}).registerLocation(__filename);

function init(socket) {

    var action = {
        bucket: "abc-fs",
        key: "registered-paths",
        cb: function(data) {
            if (activeDirectories.length === 0) {
                data.forEach(function(path) {
                    activateDir(path);
                });
            } else {
                socket.emit('initializeList', data);
            }
        }
    };

    bus.emitOnDataGet(action);


}


