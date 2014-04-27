var fs = require('fs-extra'),
        track = require('./dirTracker.js'),
        rmdir = require('rimraf');

var counter = 0;
var numOfPaths = 0;

function startTrackingCheck(targetDirPath) {
    counter++;
    console.log("Counter ", counter);
    console.log("NumofPaths" ,numOfPaths);
    if (counter === numOfPaths && numOfPaths !== 0) {
        track.registerDirectory(targetDirPath);
        counter = 0;
        numOfPaths = 0;
    }
}


function moveToAlphabetDirs(targetDir, Content) {
    var allPaths = Content.allPaths;
    numOfPaths = allPaths.length;
    allPaths.map(function(path) {
        var name = path.split('/').pop();
        moveToLetterDir(targetDir, name);
    });
}


function moveToLetterDir(targetDir, name) {
    if (isNaN(name.charAt(0))) {
        var originPath = targetDir + '/' + name;
        var destDir = targetDir + '/' + name.charAt(0).toUpperCase() + '/' + name;
        var isDirectory = fs.lstatSync(originPath).isDirectory();
        if (isDirectory) {
            //Bug here. It transfers the dir first without content and then deletes it so it doesnt exist to continiou the transfers of the content
            console.log(destDir);
            fs.copy(originPath, destDir, function(error) {
                if (error)
                   return ;


                rmdir(originPath, function(error) {
                    if (error)
                       return;
                    startTrackingCheck(targetDir);
                });

            });

        } else {
            fs.rename(originPath, destDir, function(error) {
                if (error)
                    return;
                startTrackingCheck(targetDir);


            });
        }
    }

}






exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;