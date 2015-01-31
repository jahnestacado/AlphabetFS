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
            if (!fs.existsSync(letterPath)) {
                mkdirp.sync(letterPath);
                console.log("Folder Created " + letterPath);
            }
            createLetterDir(alphabetFsStructure.shift());
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
    var answer = false;
    if (getAlphabet().indexOf(name) !== -1) {
        answer = true;
    }
    return answer;
}

function isAlphabetFSDirectory(name) {
    var answer = false;
    if (isAlphabetLetter(name) || name === otherFolder) {
        answer = true
    }
    return answer;
}

exports.initiateStructure = initiateStructure;
exports.isAlphabetLetter = isAlphabetLetter;
exports.otherFolder = otherFolder;
exports.isAlphabetFSDirectory = isAlphabetFSDirectory;
exports.getAlphabetFsStructure = getAlphabetFsStructure;
