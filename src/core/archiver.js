var bus = require('hermes-bus');
var fs = require('fs-extra');
var alphabetfsUtils = require('./alphabetfs-utils.js');
var rmdir = require('rimraf');

//TESTING MODE
//It is created and exposed using the x-poser module only for testing purposes
var self = {
    moveToLetterDir: moveToLetterDir,
}

bus.onEvent('core', 'moveToAlphabetDirs', function(targetDir, content) {
    var allPaths = content.allPaths;
    var handler = initialStateHandler();
    handler.numOfPaths = allPaths.length;
    if (handler.numOfPaths === 0) {
        handler.requestDirRegistry(targetDir);
    }
    else {
        allPaths.map(function(path) {
            var name = path.split('/').pop();
            self.moveToLetterDir(targetDir, name, handler);
        });
    }
});

bus.onEvent('core', 'moveToLetterDir', function(targetDir, fileName) {
    moveToLetterDir(targetDir, fileName);
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
    var destinationDir;
    var initialChar = name.charAt(0).toUpperCase();
    if (alphabetfsUtils.isAlphabetLetter(initialChar)) {
        destinationDir = initialChar;
    } else {
        destinationDir = alphabetfsUtils.otherFolder;
    }
    return destinationDir;
}

function initialStateHandler() {
    return {
        counter: 0,
        numOfPaths: 0,
        requestDirRegistry: function(targetDirPath) {
            this.counter++;
            if (this.counter === this.numOfPaths || this.numOfPaths === 0) {
                bus.core.emitRegisterDirectory(targetDirPath);
                this.counter = 0;
                this.numOfPaths = 0;
            }
        }
    }
}


        