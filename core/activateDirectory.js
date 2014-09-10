var pathGatherer = require('./../core/pathGatherer.js');
var mover = require('./../core/mover.js');
var alphabetDirectories = require('./../core/alphabetDirectories');
var bus = require('hermes-bus');

bus.onEvent("core", "activateDirectory", function(targetDirPath) {
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content, mover.moveToAlphabetDirs);
})