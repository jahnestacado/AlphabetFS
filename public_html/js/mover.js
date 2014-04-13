var fs = require('fs-extra'),
        fsWatcher = require('fs.notify'),
        Q = require('q'),
        rmdir = require('rimraf');

var counter = 0;
var numOfPaths = 0;

function startTrackingCheck(targetDirPath) {
    counter++;
    if (counter === numOfPaths && numOfPaths !== 0) {
        trackDirectory(targetDirPath);
        counter = 0;
        numOfPaths = 0;
    }
}



function trackDirectory(targetDirPath) {
    var notifications = new fsWatcher([targetDirPath]);
    notifications.on('change', function(file, event, path) {
        console.log('New file ' + file + ' caught a ' + event + ' event on ' + path);
        moveToLetterDir(targetDirPath, file, false);
    });
}

function moveToAlphabetDirs(targetDir, Content) {
    var allPaths = Content.allPaths;
    numOfPaths = allPaths.length;
    allPaths.map(function(path) {
        var name = path.split('/').pop();
        moveToLetterDir(targetDir, name, startTrackingCheck);
    });
}


function moveToLetterDir(targetDir, name, trackingCheck) {
    if (isNaN(name.charAt(0))) {
        var originPath = targetDir + '/' + name;
        var destDir = targetDir + '/' + name.charAt(0).toUpperCase() + '/' + name;
        var isDirectory = fs.lstatSync(originPath).isDirectory();
        if (isDirectory) {
            fs.copy(originPath, destDir, function(error) {
                if (error)
                    return false;
                else {
                    rmdir(originPath, function(error) {
                        if (error)
                            return false;
                        else
                        if (typeof (trackingCheck) === "function")
                            trackingCheck(targetDir);
                    });
                }
            });

        } else {
            fs.renameSync(originPath, destDir);
            if (typeof (trackingCheck) === "function")
                trackingCheck(targetDir);
        }
    }

}



exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;