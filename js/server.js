var http = require('http') // http module
        , fs = require('fs')// file system module
        , pathGatherer = require('./pathGatherer.js')
        , mover = require('./mover.js')
        , alphabetDirectories = require('./alphabetDirectories')
        , express = require('express')
        , path = require('path')
        , qs = require('qs'); // querystring parser
var app = express();

// store the contents of 'index.html' to a buffer
var html = fs.readFileSync('./index.html');

app.configure(function() {
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    app.set('port', process.env.PORT || 8085);
    app.use(express.static("/home/jahn/NetBeansProjects/AlbumNode/css"));
});

app.post('/', function(request, response) {
    targetDirPath = request.body.text;
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content);
    response.writeHead(200, "OK", {'Content-Type': 'text/html'});
    response.end(html);
});

app.get('/', function(request, response) {
    // for GET requests, serve up the contents in 'index.html'       
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(html);
});

http.createServer(app).listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});


