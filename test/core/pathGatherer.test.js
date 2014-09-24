var assert = require('assert');
var rmdir = require('rimraf');
var fs = require('fs');
var pathGatherer = require("./../../core/pathGatherer.js");
var utils = require("./../utils.js");

describe('setting up testing environment', function() {
    var testRoot = "tester";

    var data = {
        fileNames: ["a1.txt", "d2.pdf", "jh.8", "787.ari"],
        dirNames: ["asd", "OJk", "KHTR", "GJyf"],
        abcDirs: ['A', 'B', 'C']
    };

    function getFullPaths(names) {
        return names.map(function(name) {
            return testRoot + '/' + name;
        });
    }

    function createTestDirs(dirNames) {
        getFullPaths(dirNames).forEach(function(name) {
            fs.mkdirSync(name);
        });
    }

    function createTestFiles(fileNames) {
        getFullPaths(fileNames).forEach(function(name) {
            fs.openSync(name, 'w');
        });
    }

    before(function() {
        fs.mkdirSync(testRoot);
        createTestFiles(data.fileNames);
        createTestDirs(data.dirNames);
        createTestDirs(data.abcDirs);
    });

    describe('invoke getDirContent()', function() {

        var contents;
        before(function() {
            contents = pathGatherer.getDirContent(testRoot);
            console.log(contents)
        });

        it("should gather all file paths ", function() {
            assert.equal(utils.areArrayContentsEqual(contents.filePaths, getFullPaths(data.fileNames)), true);
        });

        it("should gather all non-ABC-letter directory paths  ", function() {
            assert.equal(utils.areArrayContentsEqual(contents.dirPaths, getFullPaths(data.dirNames)), true);
        });

        it("should gather all paths ", function() {
            assert.equal(utils.areArrayContentsEqual(contents.allPaths, getFullPaths(data.fileNames.concat(data.dirNames))), true);
        });
    })

    after(function() {
        rmdir.sync(testRoot);
         delete require.cache[require.resolve('./../../core/alphabetDirectories.js')];
        delete require.cache[require.resolve("./../../core/pathGatherer.js")];
    });
})