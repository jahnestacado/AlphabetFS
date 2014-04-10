var http = require('http') // http module
        , fs = require('fs')// file system module
        , pathGatherer = require('./pathGatherer.js')
        , mover = require('./mover.js')
        , alphabetDirectories = require('./alphabetDirectories')
        , fsWatcher = require('fs.notify')
        , express = require('express')
        , qs = require('qs'); // querystring parser
var app = express();

// store the contents of 'index.html' to a buffer
var html = fs.readFileSync('./index.html');

app.configure(function() {
    app.use(express.json());       // to support JSON-encoded bodies
    app.use(express.urlencoded()); // to support URL-encoded bodies
    app.set('port', process.env.PORT || 8085);
    //  app.use(express.static(path.join("/home/jahn/NetBeansProjects/AlbumNode", "/public_html/css/styling.css")));
});

app.post('/', function(request, response) {
    console.log(process.env.HOME);
    targetDirPath = request.body.text;

    var Content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, Content, mover.moveToAlphabetDirs);


//         var notifications = new fsWatcher([targetDirPath]);
//        notifications.on('change', function(file, event, path) {
//        console.log('New file ' + file + ' caught a ' + event + ' event on ' + path);
//        mover.moveToLetterDir(targetDirPath, file)
//        }); 

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


