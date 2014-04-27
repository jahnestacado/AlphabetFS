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
        var fullpath = path + '/' + file;
        console.log("Has not being processed ", processedFiles.indexOf(fullpath) === -1);
        console.log("Does exist ", fs.existsSync(fullpath));
        console.log("Name ", file);

        if (processedFiles.indexOf(file) === -1 && fs.existsSync(fullpath)) {
            processedFiles.push(fullpath);
            console.log('New file ' + file + 'caught a ' + event + ' event on ' + path);
            mover.moveToLetterDir(path, file);

        }

    });

}


exports.registerDirectory = registerDirectory;



        