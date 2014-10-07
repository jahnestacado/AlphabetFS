var assert = require('assert');
var fs = require('fs');
var utils = require("./../utils.js");
var sinon = require('sinon');
var pathGatherer = require("./../../core/pathGatherer.js");

describe("#################### Starting integration tests for pathGatherer module\n", function() {
    //Test data
    var testRoot = "tester";
    var fileNames = ["a1.txt", "d2.pdf", "jh.8", "787.ari"];
    var dirNames = ["asd", "OJk", "KHTR", "GJyf"];
    var abcDirs = ['A', 'B', 'C'];

    describe('setting up testing environment', function() {

        function stubLstat(lstatSyncStub, args, isFile) {
            getFullPaths(args).forEach(function(path) {
                lstatSyncStub.withArgs(path).returns({
                    isFile: function() {
                        return isFile;
                    },
                    isDirectory: function() {
                        return !isFile;
                    }
                });
            })
        }

        function getFullPaths(names) {
            return names.map(function(name) {
                return testRoot + '/' + name;
            });
        }

        describe('invoke getDirContent()', function() {
            var sandbox = sinon.sandbox.create();

            before(function() {
                sandbox.stub(fs, 'readdirSync').withArgs(testRoot).returns(fileNames.concat(dirNames).concat(abcDirs));
                var lstatSyncStub = sandbox.stub(fs, 'lstatSync');

                stubLstat(lstatSyncStub, dirNames.concat(abcDirs), false);
                stubLstat(lstatSyncStub, fileNames, true);
            });

            var contents;
            before(function() {
                contents = pathGatherer.getDirContent(testRoot);
            });

            it("should gather all file paths ", function() {
                assert.equal(utils.areArrayContentsEqual(contents.filePaths, getFullPaths(fileNames)), true);
            });

            it("should gather all non-ABC-letter directory paths  ", function() {
                assert.equal(utils.areArrayContentsEqual(contents.dirPaths, getFullPaths(dirNames)), true);
            });

            it("should gather all paths ", function() {
                assert.equal(utils.areArrayContentsEqual(contents.allPaths, getFullPaths(fileNames.concat(dirNames))), true);
            });

            after(function() {
                sandbox.restore();
                console.log("  ------------------------------ End of integration tests for pathGatherer module\n")
            });
        })
    });
});