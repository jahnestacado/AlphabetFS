var fs = require('fs')
var snitch = require('snitch');
var hound = require('hound');
var bus = require('hermes-bus');

function registerDirectory(targetDirPath) {
    bus.db.emitStorePath(targetDirPath);
    bus.socket.emitUIEvent("register-path", targetDirPath);
    var watcher = hound.watch(targetDirPath);
    var artifactUnderTransfer;

    watcher.on('create', function(fsArtifact) {
        //Only move a direct child folder of the registered directory
        if (isDirectChildArtifact(targetDirPath, fsArtifact)) {
            artifactUnderTransfer = fsArtifact;
            bus.socket.emitUIEvent("start-blinking", targetDirPath);
            
            snitch.onStopGrowing(fsArtifact, function() {
                var artifactName = fsArtifact.replace(targetDirPath + "/", "").trim();
                bus.core.emitMoveToLetterDir(targetDirPath, artifactName);
                if (artifactUnderTransfer === fsArtifact) {
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

function isDirectChildArtifact(targetDirPath, fsArtifact) {
    return fsArtifact.split("/").length - 1 === targetDirPath.split("/").length;
}


bus.onEvent('core', 'registerDirectory', function(targetDirPath) {
    registerDirectory(targetDirPath);
});



        