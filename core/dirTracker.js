var fs = require('fs')
        , snitch = require('snitch')
        , hound = require('hound')
        , mover = require('./mover.js')
        , bus = require('hermes-bus');

function registerDirectory(targetDirPath) {
    bus.emitStorePath(targetDirPath);
    bus.socket.emitUIEvent({event: "register-path", path: targetDirPath});
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

    bus.onEvent('deletePath', function(path) {
        if (path === targetDirPath) {
            watcher.unwatch(path);
        }
    }).registerLocation(__filename);

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



        