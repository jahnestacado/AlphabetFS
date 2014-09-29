var fs = require('fs')
var snitch = require('snitch');
var hound = require('hound');
var bus = require('hermes-bus');


function registerDirectory(targetDirPath) {
    bus.db.emitStorePath(targetDirPath);
    bus.socket.emitUIEvent("register-path", targetDirPath);
    var watcher = hound.watch(targetDirPath);
    var fileUnderTransfer;

    watcher.on('create', function(file, stats) {
        //Only move the parent dir
        if (file.split("/").length - 1 === targetDirPath.split("/").length) {
            fileUnderTransfer = file;
            bus.socket.emitUIEvent("start-blinking", targetDirPath);
            snitch.onStopGrowing(file, function() {
                var fileName = file.replace(targetDirPath + "/", "").trim();
                bus.core.emitMoveToLetterDir(targetDirPath,fileName);
                if (fileUnderTransfer === file) {
                    bus.socket.emitUIEvent("stop-blinking", targetDirPath);
                }
            });
        }
    });

    watcher.on('delete', function(file) {
        console.log(file + ' was deleted')
    })

    bus.onEvent('db', 'deletePath', function(path) {
        if (path === targetDirPath) {
            watcher.unwatch(path);
        }
    }).registerLocation(__filename);

}

function initialStateHandler() {
    return {
        counter: 0,
        numOfPaths: 0,
        requestDirRegistry: function(targetDirPath) {
            this.counter++;
            if (this.counter === this.numOfPaths || this.numOfPaths === 0) {
                registerDirectory(targetDirPath);
                this.counter = 0;
                this.numOfPaths = 0;
            }
        }
    }
}

exports.initialStateHandler = initialStateHandler;



        