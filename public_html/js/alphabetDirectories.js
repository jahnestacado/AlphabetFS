var fs = require('fs'),
        mkdirp = require('mkdirp');


var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function createAlphabetDirs(targetDir, Content, callback) {
  
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
                        createLetterDir(alphabet.shift());
                    });
                } else
                    createLetterDir(alphabet.shift());
            });
        } else
            callback(targetDir, Content);
    }
    createLetterDir(alphabet.shift());
}

function isAlphabetLetter(name) {
    if (alphabet.indexOf(name) === -1) {
        return false;
    }
    return true;
}

exports.createAlphabetDirs = createAlphabetDirs;
exports.isAlphabetLetter = isAlphabetLetter;


 