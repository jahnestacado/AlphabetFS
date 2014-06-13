var fs = require('fs')
        , alphabetDirectories = require('./alphabetDirectories')

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
        dirPaths: dirPaths,
        allPaths: filePaths.concat(dirPaths) 
        }
   
    return ContentPathsContainer;
}


function dirOrFileFilter(path, dirPaths, filePaths) {
    var name = path.split('/').pop();
    if (fs.lstatSync(path).isDirectory() && !alphabetDirectories.isAlphabetLetter(name)) {
        dirPaths.push(path);
    }
    else if (fs.lstatSync(path).isFile()) {
        filePaths.push(path);
    }
}

exports.getDirContent = getDirContent;
