var fs = require('fs')
        , snitch = require('snitch')
        , hound = require('hound')
        , mover = require('./mover.js');

var registeredDirs = [];

function registerDirectory(targetDirPath) {
    if (registeredDirs.indexOf(targetDirPath) === -1) {
        registeredDirs.push(targetDirPath);
        console.log("before", registeredDirs);
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



        