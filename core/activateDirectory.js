var pathGatherer = require('./../core/pathGatherer.js'),
        mover = require('./../core/mover.js'),
        alphabetDirectories = require('./../core/alphabetDirectories'),
        bus = require('hermes-bus');

bus.onEvent("core", "activateDirectory", function(targetDirPath) {
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.createAlphabetDirs(targetDirPath, content, mover.moveToAlphabetDirs);
})