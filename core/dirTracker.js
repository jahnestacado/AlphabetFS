var fs = require('fs')
        , snitch = require('snitch')
        , hound = require('hound')
        , mover = require('./mover.js')
        , bus = require('hermes-bus')
        , db = require('riak-js').getClient({host: "127.0.0.1", port: "8098"});


function registerDirectory(targetDirPath) {
    storeAndUpdateUI(targetDirPath);
    var watcher = hound.watch(targetDirPath);
    watcher.on('create', function(file, stats) {
        //Only move the parent dir
        if (file.split("/").length - 1 === targetDirPath.split("/").length) {
            snitch.onStopGrowing(file, function() {
                mover.moveToLetterDir(targetDirPath, file.replace(targetDirPath + "/", "").trim());
            });
        }
    });

    watcher.on('delete', function(file) {
        console.log(file + ' was deleted')
    })
}


function storeAndUpdateUI(path) {
    db.get("abc-fs", "registered-paths", function(error, registeredPaths) {
        registeredPaths.push(path);
        db.save("abc-fs", "registered-paths", registeredPaths);
        bus.emit('socket-ui-event', {event: "register-path", path: path});
    });
}


var checker = {
    counter: 0,
    numOfPaths: 0,
    trackingCheck: function(targetDirPath) {
        this.counter++;
        if (this.counter === this.numOfPaths || this.numOfPaths === 0) {
            registerDirectory(targetDirPath);
            this.counter = 0;
            this.numOfPaths = 0;
        }
    }
}


exports.registerDirectory = registerDirectory;
exports.checker = checker;



        