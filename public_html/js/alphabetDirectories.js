var fs = require('fs'),
        pathChecker = require('path'),
        mkdirp = require('mkdirp');




function createAlphabetDirs(targetDir) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    alphabet.forEach(function(letter) {
        var path = targetDir + '/' + letter;
        fs.exists(path, function(exists) {
            if (!exists) {
                mkdirp(path, function(error) {
                    if (error) {
                        console.log("Error occured: " + error);
                    }
                });
            }
        });
    });
    console.log('Alphabet directory structure status: OK.')
}

exports.createAlphabetDirs = createAlphabetDirs;


 