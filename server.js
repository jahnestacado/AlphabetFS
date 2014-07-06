var http = require('http') // http module
        , fs = require('fs')// file system module
        , pathGatherer = require('./core/pathGatherer.js')
        , mover = require('./core/mover.js')
        , alphabetDirectories = require('./core/alphabetDirectories')
        , express = require('express')
        , bodyParser = require('body-parser');

var app = express();

// store the contents of 'index.html' to a buffer
var html = fs.readFileSync(__dirname + '/public/index.html');

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
app.set('port', process.env.PORT || 8085);
app.use(express.static(__dirname + '/public/css'));

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


