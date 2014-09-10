var fs = require('fs-extra');
var alphabetDirectories = require('./alphabetDirectories');
var rmdir = require('rimraf');
var dirTracker = require('./dirTracker');

function moveToAlphabetDirs(targetDir, content) {
    var allPaths = content.allPaths;
    var handler = dirTracker.initialStateHandler();
    handler.numOfPaths = allPaths.length;
    if (handler.numOfPaths === 0) {
        handler.requestDirRegistry(targetDir);
    }
    else {
        allPaths.map(function(path) {
            var name = path.split('/').pop();
            moveToLetterDir(targetDir, name, handler);
        });
    }
}

function moveToLetterDir(targetDir, name, handler) {
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
                if (handler) {
                    handler.requestDirRegistry(targetDir);
                }
            });

        });
    } else {
        fs.rename(originPath, destDir, function(error) {
            if (error) {
                console.log("error");
                return;
            }
            if (handler) {
                handler.requestDirRegistry(targetDir);
            }
        });
    }
}

function findDestDir(name) {
    var initialChar = name.charAt(0).toUpperCase();
    if (alphabetDirectories.isAlphabetLetter(initialChar)) {
        return initialChar;
    }
    return alphabetDirectories.otherFolder;
}

exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;