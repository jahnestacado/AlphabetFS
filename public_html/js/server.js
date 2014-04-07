var http = require('http') // http module
        , fs = require('fs')// file system module
        , pathGatherer = require('./pathGatherer.js')
        , mover = require('./mover.js')
        , alphabetDirectories = require('./alphabetDirectories')
        , fsWatcher = require('fs.notify')
        , qs = require('qs'); // querystring parser

// store the contents of 'index.html' to a buffer
var html = fs.readFileSync('./index.html');

// create the http server
http.createServer(function(request, response) {

    // handle the routes
    if (request.method == 'POST') {

        request.on('data', function(chunk) {
            console.log("Received body data:");
            var postObject = qs.parse(chunk.toString());
            // targetDirPath = postObject.text;
            targetDirPath = '/home/jahn/Desktop/temp';

            var Content = pathGatherer.getDirContent(targetDirPath);
            alphabetDirectories.createAlphabetDirs(targetDirPath, Content, mover.moveToAlphabetDirs);

            var notifications = new fsWatcher([targetDirPath]);
            notifications.on('change', function(file, event, path) {
                console.log('New file ' + file + ' caught a ' + event + ' event on ' + path);
                mover.moveToLetterDir(targetDirPath, file)
            });
        });
        
        request.on('end', function() {
            // empty 200 OK response for now
            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.end(html);
        });


    } else {

        // for GET requests, serve up the contents in 'index.html'
        response.writeHead(200, {'Content-Type': 'text/html'});

        response.end(html);
    }

}).listen(8085);


