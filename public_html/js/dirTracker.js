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
        onFsChange();
    }

}


function onFsChange() {

    notifications.on('change', function(file, event, path) {
        var fullpath = getFullPath(path, file);
        console.log("Ok to process ", processedFiles.indexOf(fullpath) === -1);
        console.log("Does exist ", fs.existsSync(fullpath));
        console.log("Name ", file);
        // should put it in prototype of array to check if element exists
        if (processedFiles.indexOf(file) === -1 && fs.existsSync(fullpath)) {
            processedFiles.push(fullpath);
            console.log('New file ' + file + 'caught a ' + event + ' event on ' + path);

            check(path, file);
        }

    });

}

function getFullPath(targetDir, fileName) {
    return   targetDir + '/' + fileName;
}


function check(targetDir, fileName) {

    var path = getFullPath(targetDir, fileName);
    var oldSize = 0;

    function listenUntilIsDone() {


        if (getSize(path) === 4096) {
            var content = fs.readdirSync(path);
            var size = content.reduce(function(total, file) {
                return total + getSize(targetDir + '/' + fileName + '/' + file);
            }, 0);
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


function getSize(filename) {
    var exists = fs.existsSync(filename);
    if (exists) {
        return fs.statSync(filename).size;
    }
    return 0;
}


exports.registerDirectory = registerDirectory;



        