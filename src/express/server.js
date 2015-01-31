var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var bus = require('hermes-bus');

server.listen(8085);

var activeDirectories = [];
app.use(express.static(__dirname + '/../../public/css'));
app.use(express.static(__dirname + '/../../public'));



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


    bus.onEvent("socket", "UIEvent", function(event, path) {
        socket.emit(event,path);
    }).registerLocation(__filename);

});


bus.onEvent('db', 'deletePath', function(path) {
    var index = activeDirectories.indexOf(path);
    activeDirectories.splice(index, 1);
}).registerLocation(__filename);

function init(socket) {
   
       function cb(data) {
            if (activeDirectories.length === 0) {
                data.forEach(function(path) {
                    bus.core.emitActivateDirectory(path);
                    activeDirectories.push(path);
                });
            } else {
                // On page reload
                socket.emit('initializeList', data);
                bus.socket.emitInitStatusOfBalls();
            }
        }
   

    bus.db.emitOnDataGet("abc-fs","registered-paths",cb);
}


