var assert = require("assert");
var pathGatherer = require("../../core/pathGatherer.js");
var rmdir = require('rimraf');
var fs = require('fs');

describe('setting up testing environment', function() {
    var testRoot = "tester";

    var testPaths = {
        fileNames: ["a1.txt", "d2.pdf", "jh.8", "787.ari"],
        dirNames: ["asd", "OJk", "KHTR", "GJyf"],
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
            fs.openSync(name, 'w')
        });
    }

    function areArraysEqual(a1, a2) {
        var areEqual = a1.length === a2.length;
        if (areEqual) {
            a1.sort();
            a2.sort();
            a1.forEach(function(element){
                var index = a1.indexOf(element);
                areEqual = element === a2[index] && areEqual;
            });
            return areEqual;
        } else {
            return areEqual;
        }
    }

    before(function() {
        fs.mkdirSync(testRoot);
        createTestFiles(testPaths.fileNames);
        createTestDirs(testPaths.dirNames);
    });

    describe('gather paths', function() {

        var contents;
        before(function() {
            contents = pathGatherer.getDirContent(testRoot);
        });


        it("should gather all file paths ", function() {
            assert.equal(areArraysEqual(contents.filePaths, getFullPaths(testPaths.fileNames)), true);
        });


        it("should gather all directory paths ", function() {
            assert.equal(areArraysEqual(contents.dirPaths, getFullPaths(testPaths.dirNames)), true);
        });


        it("should gather all paths ", function() {
            assert.equal(areArraysEqual(contents.allPaths, getFullPaths(testPaths.fileNames.concat(testPaths.dirNames))), true);
        });
    })

    after(function() {
        rmdir.sync(testRoot);
    });
})