var http = require('http') // http module
        , fs = require('fs')// file system module
        , url = require('url')
        , qs = require('qs'); // querystring parser

// store the contents of 'index.html' to a buffer
var html = fs.readFileSync('./index.html');

// create the http server
http.createServer(function(request, response) {

    // handle the routes
    if (request.method == 'POST') {

        // pipe the request data to the console
        //  request.pipe(process.stdout);

       
        request.on('data', function(chunk) {
            console.log("Received body data:");
            var postObject = qs.parse(chunk.toString());
            console.log(postObject.text);
        });



        request.on('end', function() {
            // empty 200 OK response for now
            response.writeHead(200, "OK", {'Content-Type': 'text/html'});
            response.end();
        });


    } else {

        // for GET requests, serve up the contents in 'index.html'
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.end(html);
    }

}).listen(8085);


function printer(text) {
    console.log(text);
}