var fs = require('fs-extra'),
         track = require('./dirTracker.js'),
         rmdir = require('rimraf');

var counter = 0;
var numOfPaths = 0;

function startTrackingCheck(targetDirPath) {
    counter++;
    console.log("Counterrrr ", counter);
    console.log("NumOfPaths ", numOfPaths);
    if (counter === numOfPaths || numOfPaths === 0) {
        track.registerDirectory(targetDirPath);
        counter = 0;
        numOfPaths = 0;
    }
}


function moveToAlphabetDirs(targetDir, Content) {
    var allPaths = Content.allPaths;
    numOfPaths = allPaths.length;
    if (numOfPaths === 0) {
        startTrackingCheck(targetDir);
    }
    else {
        allPaths.map(function(path) {
            var name = path.split('/').pop();
            moveToLetterDir(targetDir, name, startTrackingCheck);
        });
    }
}


function moveToLetterDir(targetDir, name, callback) {
    if (isNaN(name.charAt(0))) {
        var originPath = targetDir + '/' + name;
        var destDir = targetDir + '/' + name.charAt(0).toUpperCase() + '/' + name;
        var isDirectory = fs.lstatSync(originPath).isDirectory();
        if (isDirectory) {
            fs.copy(originPath, destDir, function(error) {
                if (error)
                    return;
                rmdir(originPath, function(error) {
                    if (error) {
                        console.log("error");
                        return;
                    }
                    if (callback) {
                        startTrackingCheck(targetDir);
                    }
                });

            });
        } else {
            fs.rename(originPath, destDir, function(error) {
                if (error) {
                    console.log("error");
                    return;
                }
                if (callback) {
                    startTrackingCheck(targetDir);
                }
            });
        }
    }

}






exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;