var fs = require('fs-extra'),
        rmdir = require('rimraf');

function moveToAlphabetDirs(targetDir, Content) {
    var allPaths = Content.allPaths;
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

            fs.copy(originPath, destDir, function(err) {
                if (err) {
                    return console.error(err);
                } else {
                    rmdir(originPath, function(err) {
                        if (err) 
                            return console.error(err);                        
                        console.log("Removing dir " + originPath);
                    });
                }
            });
        } else
            fs.renameSync(originPath, destDir);
    }

}



exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;