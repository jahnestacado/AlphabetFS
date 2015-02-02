var pathGatherer = require('./pathGatherer.js');
var alphabetfsUtils = require('./alphabetfs-utils.js');
var bus = require('hermes-bus');

bus.onEvent("core", "activateDirectory", function(targetDirPath) {
    var content = pathGatherer.getDirContent(targetDirPath);
    alphabetfsUtils.initiateStructure(targetDirPath, content);
})