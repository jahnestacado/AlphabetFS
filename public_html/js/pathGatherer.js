var fs = require('fs')// file system module


function getDirContent(targetDirPath) {
    var filePaths = [];
    var dirPaths = [];
    var contentNames = fs.readdirSync(targetDirPath);


    contentNames.forEach(function(name) {
        var path = targetDirPath + '/' + name;
        dirOrFileFilter(path, dirPaths, filePaths);
    });

    var ContentPathsContainer = {
        filePaths: filePaths,
        dirPaths: dirPaths
    }

    return ContentPathsContainer;
}


function dirOrFileFilter(path, dirPaths, filePaths) {
    if (fs.lstatSync(path).isDirectory()) {
        dirPaths.push(path);
    }
    else if (fs.lstatSync(path).isFile()) {
        filePaths.push(path);
    }
}



exports.getDirContent = getDirContent;
