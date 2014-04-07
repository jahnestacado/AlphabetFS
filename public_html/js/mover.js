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
        if (fs.lstatSync(originPath).isDirectory()) {
            fs.copySync(originPath, destDir, function(err) {
                if (err)
                    return console.error(err);

            });
            rmdir(originPath, function(error) {
                console.log(error);
            });
        } else
            fs.renameSync(originPath, destDir);
    }

}



exports.moveToAlphabetDirs = moveToAlphabetDirs;
exports.moveToLetterDir = moveToLetterDir;