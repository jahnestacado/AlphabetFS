var pathGatherer = require('./core/pathGatherer.js')
        , mover = require('./core/mover.js')
        , alphabetDirectories = require('./core/alphabetDirectories')
        , express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , bus = require('hermes-bus');


server.listen(8085);

app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
    console.log("OnConnection ");

    socket.on('path-entry', function(data) {
        var targetDirPath = data;
        var content = pathGatherer.getDirContent(targetDirPath);
        alphabetDirectories.createAlphabetDirs(targetDirPath, content);
    });


    bus.onEvent(this, "socket-UIEvent", function(data) {
        socket.emit(data.event, data.path);
    });

});



