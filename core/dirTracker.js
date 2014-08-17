var fs = require('fs')
        , snitch = require('snitch')
        , hound = require('hound')
        , mover = require('./mover.js')
        , bus = require('hermes-bus');


function registerDirectory(targetDirPath) {
    bus.emit("store-path-n-update-ui", targetDirPath);
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

    bus.onEvent(this, 'path-delete', function(path) {
        watcher.unwatch(path);
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



        