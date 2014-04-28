var Notify = require('fs.notify')
        , fs = require('fs')
        , mover = require('./mover.js');

var registeredDirs = [];
var notifications = new Notify(registeredDirs);
var processedFiles = [];

function registerDirectory(targetDirPath) {
    if (registeredDirs.indexOf(targetDirPath) === -1) {
        registeredDirs.push(targetDirPath);
        console.log("before", registeredDirs);
        notifications.add(registeredDirs);
        console.log("before", registeredDirs);
        createOnChangeListener();
    }

}


function createOnChangeListener() {
    notifications.on('change', function(file, event, path) {
        var fullpath = getFullPath(path, file);
        // should put it in prototype of array to check if element exists
        if (processedFiles.indexOf(file) === -1 && fs.existsSync(fullpath)) {
            processedFiles.push(fullpath);
            console.log('New file ' + file + ' caught a ' + event + ' event on ' + path);
            moveFileWhenComplete(path, file);
        }

    });

}

function getFullPath(targetDir, fileName) {
    return   targetDir + '/' + fileName;
}


function moveFileWhenComplete(targetDir, fileName) {
    var path = getFullPath(targetDir, fileName);
    var oldSize = 0;

    function listenUntilIsDone() {

        if (isADirectory(path)) {
           // var content = fs.readdirSync(path);
            var size = getSizeSnapshot(path);
            console.log("Sizeee ", size);

            if (size !== 0 && oldSize === size) {
                mover.moveToLetterDir(targetDir, fileName);
            }
            else {
                oldSize = size;
                setTimeout(listenUntilIsDone, 2000);
            }
        }
        else
            mover.moveToLetterDir(targetDir, fileName);
    }

    listenUntilIsDone();

}


function getSingleFileSize(filename) {
    var exists = fs.existsSync(filename);
    if (exists) {
        return fs.statSync(filename).size;
    }
    return 0;
}

function isADirectory(path) {
    return getSingleFileSize(path) === 4096;
}


function getSizeSnapshot(path) {
    if (isADirectory(path)) {
        var content = fs.readdirSync(path);
        var size = content.reduce(function(total, file) {
            return total + getSizeSnapshot(path + '/' + file);
        }, 0)
        return size;
    }
    else
        return getSingleFileSize(path);
}


exports.registerDirectory = registerDirectory;



        