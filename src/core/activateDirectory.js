var pathCollector = require('./path-collector.js');
var alphabetfsUtils = require('./alphabetfs-utils.js');
var bus = require('hermes-bus');

bus.onEvent("core", "activateDirectory", function(targetDirPath) {
    var content = pathCollector.getDirContent(targetDirPath);
    alphabetfsUtils.initiateStructure(targetDirPath, content);
})