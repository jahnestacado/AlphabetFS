var fs = require('fs'),
        mover = require('./mover.js'),
        mkdirp = require('mkdirp');

function getAlphabet() {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    return alphabet;
}

function createAlphabetDirs(targetDir, Content) {
    var alphabetTmp = getAlphabet();
    console.log("ALphabet size ", alphabetTmp.length)
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
                        createLetterDir(alphabetTmp.shift());
                    });
                } else
                    createLetterDir(alphabetTmp.shift());
            });
        } else
            mover.moveToAlphabetDirs(targetDir, Content);
    }
    createLetterDir(alphabetTmp.shift());
}

function isAlphabetLetter(name) {
    if (getAlphabet().indexOf(name) === -1) {
        return false;
    }
    return true;
}

exports.createAlphabetDirs = createAlphabetDirs;
exports.isAlphabetLetter = isAlphabetLetter;


 