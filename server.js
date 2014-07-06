var http = require('http') // http module
        , fs = require('fs')// file system module
        , pathGatherer = require('./core/pathGatherer.js')
        , mover = require('./core/mover.js')
        , alphabetDirectories = require('./core/alphabetDirectories')
        , express = require('express')
        , app = express()
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , bodyParser = require('body-parser');


server.listen(8085);

app.use(express.static(__dirname + '/public/css'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies


io.sockets.on('connection', function(socket) {
    console.log("OnConnection ");

    socket.on('path-entry', function(data) {
        var targetDirPath = data;
        var content = pathGatherer.getDirContent(targetDirPath);
        alphabetDirectories.createAlphabetDirs(targetDirPath, content);
    });


});



//app.post('/', function(request, response) {

//    response.writeHead(200, "OK", {'Content-Type': 'text/html'});
//    response.end(html);
//});
//
//app.get('/', function(request, response) {
//    // for GET requests, serve up the contents in 'index.html'       
//    response.writeHead(200, {'Content-Type': 'text/html'});
//    response.end(html);
//});
//
//http.createServer(app).listen(app.get('port'), function() {
//    console.log('Express server listening on port ' + app.get('port'));
//});


