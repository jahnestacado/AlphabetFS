var fs = require('fs-extra');
var alphabetDirectories = require('./alphabetDirectories');
var rmdir = require('rimraf');
var dirTracker = require('./dirTracker');
var bus = require('hermes-bus');

bus.onEvent('core', 'moveToAlphabetDirs', function(data) {
    var allPaths = data.content.allPaths;
    var handler = dirTracker.initialStateHandler();
    handler.numOfPaths = allPaths.length;
    if (handler.numOfPaths === 0) {
        handler.requestDirRegistry(data.targetDir);
    }
    else {
        allPaths.map(function(path) {
            var name = path.split('/').pop();
            moveToLetterDir(data.targetDir, name, handler);
        });
    }
});

bus.onEvent('core', 'moveToLetterDir', function(data) {
    moveToLetterDir(data.targetDir, data.fileName, data.handler);
});


function moveToLetterDir(targetDir, fileName, handler) {
    var originPath = targetDir + '/' + fileName;
    var destDir = targetDir + '/' + findDestDir(fileName) + '/' + fileName;
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
