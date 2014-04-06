var fs = require('fs-extra'),
        rmdir = require('rimraf');

function moveToAlphabetDirs(targetDir, Content) {
    var allPaths = Content.allPaths;
    console.log("Da pathssss:" +allPaths);
    allPaths.map(function(path) {
        moveToLetterDir(targetDir, path);
        console.log(path);
    });
}

function moveToLetterDir(targetDir, originPath) {
    var name = originPath.split('/').pop();
    var destDir = targetDir + '/' + name.charAt(0).toUpperCase() + '/' + name;
    console.log('------');
    console.log(name)
    console.log(destDir);
    if (fs.lstatSync(originPath).isDirectory()) {
        fs.copySync(originPath, destDir, function(err) {
            if (err)
                return console.error(err);

            console.log("success!")
        });
        rmdir(originPath,function(error){
            console.log(error);
        });
    } else
        fs.renameSync(originPath, destDir)
}

exports.moveToAlphabetDirs = moveToAlphabetDirs;