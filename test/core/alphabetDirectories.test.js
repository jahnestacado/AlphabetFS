var assert = require('assert');
var abcDirs = require('./../../src/core/alphabetDirectories.js');
var sinon = require('sinon');
var fs = require('fs');
var mkdirp = require('mkdirp');
var bus = require('hermes-bus');

describe("#################### Starting integration tests for 'alphabetDirectories' module", function() {
    var sandbox = sinon.sandbox.create();
    var testingFolder = "testing-workspace";
    var fsExistsStub;
    var mkdirpStub;
    var emitMoveToAlphabetDirsSpy;

    abcDirTestingPaths = abcDirs.getAlphabetFsStructure().map(function(abcFsDir) {
        return testingFolder + '/' + abcFsDir;
    });

     before("loading events",function() {
        bus.subscribeEventsFrom('./src/core/mover.js');
     });

    before("stubbing relevant function", function() {
        fsExistsStub = sandbox.stub(fs, 'existsSync');
        mkdirpStub = sandbox.stub(mkdirp, "sync");
        emitMoveToAlphabetDirsSpy = bus.core.emitMoveToAlphabetDirs = sandbox.spy();
        sandbox.stub(abcDirs, 'isAlphabetFSDirectory', function() {
            return false;
        });
    });

    describe('invoke initiateStructure', function() {
        var content = {};
        
        before(function() {
            abcDirTestingPaths.forEach(function(element) {
                fsExistsStub.withArgs(element)
                        .onCall(0).returns(false)
                        .onCall(1).returns(true);
                mkdirpStub.withArgs(element).returns(true);
            });
        });

        before(function(done) {
            abcDirs.initiateStructure(testingFolder, content, done);
        });

        abcDirTestingPaths.forEach(function(element) {
            it('should have been called with argument ' + element, function() {
                assert(mkdirpStub.withArgs(element).calledOnce);
            });
        });

        it('should have invoked mkdirp 27 times', function() {
            assert.equal(mkdirpStub.callCount, 27);
        });

        it('should invoke  bus.core.emitMoveToAlphabetDirs', function() {
            assert(emitMoveToAlphabetDirsSpy.calledOnce);
        });

        describe('invoke again initiateStructure while abcStructure is already created', function() {

            before(function(done) {
                abcDirs.initiateStructure(testingFolder, content, done);
            });

            it('should not invoke mkdirp again', function() {
                assert.equal(mkdirpStub.callCount, 27);
            });

            it('should invoke  bus.core.emitMoveToAlphabetDirs again', function() {
                assert(emitMoveToAlphabetDirsSpy.calledTwice);
            });
        });

        after(function() {
            mkdirpStub.reset();
            emitMoveToAlphabetDirsSpy.reset();
        });

    });

    after(function() {
        sandbox.restore();
        bus.hardReset();
        console.log("  ------------------------------ End of integration tests for 'alphabetDirectories' module\n")
    });
    
});