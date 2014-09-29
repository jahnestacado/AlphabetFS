var fs = require('fs');
var mkdirp = require('mkdirp');
var bus = require('hermes-bus');
var otherFolder = "#$%123";

function getAlphabet() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet;
}

function getAlphabetFsStructure() {
    return getAlphabet().concat([otherFolder]);
}

function initiateStructure(targetDir, content, onDone) {
    var alphabetFsStructure = getAlphabetFsStructure();
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
            bus.core.emitMoveToAlphabetDirs(targetDir, content);
            if (onDone && typeof (onDone) === "function") {
                onDone();
            }
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
exports.getAlphabetFsStructure = getAlphabetFsStructure;
