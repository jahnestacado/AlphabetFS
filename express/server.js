var express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , bus = require('hermes-bus');

server.listen(8085);

var activeDirectories = [];
app.use(express.static(__dirname + '/../public/css'));
app.use(express.static(__dirname + '/../public'));



io.sockets.on('connection', function(socket) {
    console.log("OnConnection ");

    init(socket);

    socket.on('path-entry', function(targetDirPath) {
        if (activeDirectories.indexOf(targetDirPath) === -1) {
            bus.core.emitActivateDirectory(targetDirPath)
            activeDirectories.push(targetDirPath);
        }
    });

    socket.on('path-delete', function(path) {
        bus.db.emitDeletePath(path);
    });


    bus.onEvent("socket", "UIEvent", function(data) {
        socket.emit(data.event, data.path);
    }).registerLocation(__filename);

});


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
                    bus.core.emitActivateDirectory(path);
                    activeDirectories.push(path);
                });
            } else {
                socket.emit('initializeList', data);
            }
        }
    };

    bus.db.emitOnDataGet(action);


}


