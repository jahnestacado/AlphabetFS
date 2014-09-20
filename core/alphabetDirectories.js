var fs = require('fs');
var mkdirp = require('mkdirp');
var bus = require('hermes-bus');
var otherFolder = "#$%123";

function getAlphabet() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet;
}

function initiateStructure(targetDir, content) {
    var alphabetFsStructure = getAlphabet().concat([otherFolder]);
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
        } else {
            bus.core.emitMoveToAlphabetDirs({targetDir:targetDir, content:content});
        }
    }
    createLetterDir(alphabetFsStructure.shift());
}

function isAlphabetLetter(name) {
    if (getAlphabet().indexOf(name) === -1) {
        return false;
    }
    return true;
}

function isAlphabetFSDirectory(name) {
    if (isAlphabetLetter(name) || name === otherFolder) {
        return true
    }
    return false;
}

exports.initiateStructure = initiateStructure;
exports.isAlphabetLetter = isAlphabetLetter;
exports.otherFolder = otherFolder;
exports.isAlphabetFSDirectory = isAlphabetFSDirectory;


 