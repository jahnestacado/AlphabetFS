var fs = require('fs');
var alphabetfsUtils = require('./alphabetfs-utils.js');

function getDirContent(targetDirPath) {
    var filePaths = [];
    var dirPaths = [];
    var contentNames = fs.readdirSync(targetDirPath);

    contentNames.forEach(function(name) {
        var path = targetDirPath + '/' + name;
        dirOrFileHandler(path, dirPaths, filePaths);
    });

    var contentHolder = {
        filePaths: filePaths,
        dirPaths: dirPaths,
        allPaths: filePaths.concat(dirPaths)
    };

    return contentHolder;
}


function dirOrFileHandler(path, dirPaths, filePaths) {
    var name = path.split('/').pop();
    if (fs.lstatSync(path).isDirectory() && !alphabetfsUtils.isAlphabetFSDirectory(name)) {
        dirPaths.push(path);
    }
    else if (fs.lstatSync(path).isFile()) {
        filePaths.push(path);
    }
}

exports.getDirContent = getDirContent;
