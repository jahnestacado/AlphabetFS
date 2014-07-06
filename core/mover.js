var fs = require('fs-extra'),
        tracker = require('./dirTracker.js'),
        alphabetDirectories = require('./alphabetDirectories'),
        rmdir = require('rimraf');

var checker = tracker.checker;

function moveToAlphabetDirs(targetDir, content) {
    var allPaths = content.allPaths;
    checker.numOfPaths = allPaths.length;
    if (checker.numOfPaths === 0) {
        checker.trackingCheck(targetDir);
    }
    else {
        allPaths.map(function(path) {
            var name = path.split('/').pop();
            moveToLetterDir(targetDir, name, checker.trackingCheck);
        });
    }
}


function moveToLetterDir(targetDir, name, callback) {
        var originPath = targetDir + '/' + name;
        var destDir = targetDir + '/' + findDestDir(name) + '/' + name;
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
                        checker.trackingCheck(targetDir);
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
                    checker.trackingCheck(targetDir);
                }
            });
        }
}

function findDestDir(name){
    var initialChar =  name.charAt(0).toUpperCase();
    if(alphabetDirectories.isAlphabetLetter(initialChar)){
        return initialChar;
    }
    return alphabetDirectories.nonAlphabetFolderName;
}

exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;