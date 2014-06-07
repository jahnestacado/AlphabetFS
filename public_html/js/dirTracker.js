var fs = require('fs')
        , snitch = require('./snitch.js')
        , hound = require('hound')
        , mover = require('./mover.js');

var registeredDirs = [];
var processedFiles = [];

function registerDirectory(targetDirPath) {
    if (registeredDirs.indexOf(targetDirPath) === -1) {
        registeredDirs.push(targetDirPath);
        console.log("before", registeredDirs);
        var watcher = hound.watch(targetDirPath);

        watcher.on('create', function(file, stats) {
            if (file.split("/").length - 1 === targetDirPath.split("/").length) {
                snitch.onTransferFinished(file, function() {
                    mover.moveToLetterDir(targetDirPath, file.replace(targetDirPath + "/", "").trim());
                });
            }
        });

        watcher.on('delete', function(file) {
            console.log(file + ' was deleted')
        })
    }

}

exports.registerDirectory = registerDirectory;



        