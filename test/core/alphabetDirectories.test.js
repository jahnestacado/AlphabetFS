var assert = require('assert');
var abcDirs = require('./../../core/alphabetDirectories.js');
var pathGatherer = require("./../../core/pathGatherer.js");
var sinon = require('sinon');
var bus = require('hermes-bus');
var utils = require("./../utils.js");
var fs = require('fs');
var rmdir = require('rimraf');
var testingFolder = "testing-workspace";

var old = abcDirs.isAlphabetFSDirectory;

describe('#################### Starting integration tests for alphabetDirectories module', function() {
    bus.subscribeEventsFrom('./core/mover.js');

    var isAlphabetFSDirectoryStub = sinon.stub(abcDirs, 'isAlphabetFSDirectory', function() {
        return false;
    });

    describe('invoke initiateStructure', function() {
        var content = {};
        var abcDirTestingPaths = abcDirs.getAlphabetFsStructure().map(function(absFsDir) {
            return testingFolder + '/' + absFsDir;
        });

        bus.core.emitMoveToAlphabetDirs = sinon.spy();

        before(function(done) {
            abcDirs.initiateStructure(testingFolder, content, done);
        });

        it('should invoke  bus.core.emitMoveToAlphabetDirs', function() {
            assert(bus.core.emitMoveToAlphabetDirs.calledOnce);
        });

        describe('gather targeted directory content', function() {

            var testingDirContent;
            before(function() {
                testingDirContent = pathGatherer.getDirContent(testingFolder);
            });

            it('should have created alphabetFs structure', function() {
                assert(utils.areArrayContentsEqual(abcDirTestingPaths, testingDirContent.dirPaths));
            });

        });

        describe('create file x-file.txt in X directory', function() {

            var x_filePath = testingFolder + "/X" + "/x-file.txt";
            before(function() {
                fs.openSync(x_filePath, 'w')
            });

            it('should have created x-file inside X directory', function() {
                assert(fs.existsSync(x_filePath));
            });

            describe('invoke again initiateStructure ', function() {

                var testingDirContent;
                before(function(done) {
                    abcDirs.initiateStructure(testingFolder, content, done);
                    testingDirContent = pathGatherer.getDirContent(testingFolder);
                });

                it('should have valid alphabetFs structure', function() {
                    assert(utils.areArrayContentsEqual(abcDirTestingPaths, testingDirContent.dirPaths));
                });

                it('should not overwrite content of X directory', function() {
                    assert(fs.existsSync(x_filePath));
                });

            });

        });

    });

    after(function() {
        rmdir.sync(testingFolder);
        isAlphabetFSDirectoryStub.restore();
        console.log("  ------------------------------ End of integration tests for alphabetDirectories module\n")
    });


});