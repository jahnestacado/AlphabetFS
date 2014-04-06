var fs = require('fs'),
        pathChecker = require('path'),
        mkdirp = require('mkdirp');


var alphabetString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function createAlphabetDirs(targetDir, Content, callback) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.map(function(letter) {
        var path = targetDir + '/' + letter;
        fs.exists(path, function(exists) {
            if (!exists) {
                mkdirp(path, function(error) {
                    if (error) {
                        console.log("Error occured: " + error);
                        return false;
                    }
                    console.log("Folder Created " + path);
                    return true;
                });
            }
        });
        
    }, callback(targetDir, Content));
  
 
}

function isAlphabetLetter(name) {
    if (alphabetString.split("").indexOf(name) === -1) {
        console.log("Den einai");
        return false;
    }
    return true;
}

exports.createAlphabetDirs = createAlphabetDirs;
exports.isAlphabetLetter = isAlphabetLetter;


 