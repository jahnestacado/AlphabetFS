var fs = require('fs'),
        mover = require('./mover.js'),
        mkdirp = require('mkdirp');

var nonAlphabetFolderName = "#$%123";

function getAlphabet() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet;
}

function createAlphabetDirs(targetDir, content) {
    var alphabetFsStructure = getAlphabet().concat([nonAlphabetFolderName]); 
    function createLetterDir(letter) {
        if (letter) {
            var letterPath = targetDir + '/' + letter;
            fs.exists(letterPath, function(exists) {
                if (!exists) {
                    mkdirp(letterPath, function(error) {
                        if (error) {
                            console.log("Error occured: " + error);
                        }
                        console.log("Folder Created " + letterPath);
                        createLetterDir(alphabetFsStructure.shift());
                    });
                } else
                    createLetterDir(alphabetFsStructure.shift());
            });
        } else
            mover.moveToAlphabetDirs(targetDir, content);
    }
    createLetterDir(alphabetFsStructure.shift());
}

function isAlphabetLetter(name) {
    if (getAlphabet().indexOf(name) === -1) {
        return false;
    }
    return true;
}

exports.createAlphabetDirs = createAlphabetDirs;
exports.isAlphabetLetter = isAlphabetLetter;
exports.nonAlphabetFolderName = nonAlphabetFolderName;


 