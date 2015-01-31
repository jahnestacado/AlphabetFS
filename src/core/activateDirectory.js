var pathGatherer = require('./pathGatherer.js');
var alphabetDirectories = require('./alphabetDirectories');
var bus = require('hermes-bus');

bus.onEvent("core", "activateDirectory", function(targetDirPath) {
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetDirectories.initiateStructure(targetDirPath, content);
})