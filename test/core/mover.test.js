var assert = require('assert');
var sinon = require('sinon');
var X = require('x-poser');
var bus = require('hermes-bus');

describe('#################### Starting integration tests for mover module', function() {
    var sandbox = sinon.sandbox.create();
    var moveToLetterDirStub;
    var mover;

    before(function() {
        mover = X.require('./core/mover.js', 'auto');
        bus.subscribeEventsFrom('./core/dirTracker');
        moveToLetterDirStub = sandbox.stub(mover.self, 'moveToLetterDir');
        bus.core.emitRegisterDirectory = sandbox.stub();
    });

    describe('register empty directory to AlphabetFs', function() {
        var targetDir = "test/target/dir";
        var content = {allPaths: []};

        before(function() {
            bus.core.emitMoveToAlphabetDirs(targetDir, content);
        });

        it("should not invoke moveToLetterDir", function() {
            assert.equal(moveToLetterDirStub.called, false);
        });

        it("should invoke  bus.core.emitRegisterDirectory once", function() {
            assert(bus.core.emitRegisterDirectory.calledOnce);
        });

        it("should invoke  bus.core.emitRegisterDirectory with right argument", function() {
            assert(bus.core.emitRegisterDirectory.calledWith(targetDir));
        });

        after(function() {
            bus.core.emitRegisterDirectory.reset();
            moveToLetterDirStub.reset();
        });

    });

    describe('register directory that contains three elements to AlphabetFs', function() {
        var callCount = 0;
        var targetDir = "test/target/dir";
        var content = {
            allPaths: [
                targetDir + "/one",
                targetDir + "/two",
                targetDir + "/three"
            ]};

        before(function() {
            bus.core.emitMoveToAlphabetDirs(targetDir, content);
        });

        it("should invoke moveToLetterDir three times ", function() {
            assert.equal(moveToLetterDirStub.callCount, 3);
        });

        content.allPaths.forEach(function(path) {
            describe('on #' + callCount++ + "call of moveToLetterDir", function() {
                var args;

                before(function() {
                    args = moveToLetterDirStub.args[callCount];
                });

                it("should invoke moveToLetterDir with right arguments", function() {
                    assert(moveToLetterDirStub.calledWith(targetDir, path.split('/').pop()));
                });
            });

        });

        after(function() {
            moveToLetterDirStub.reset();
        });

    });

    after(function() {
        sandbox.restore();
        bus.core.destroy();
        console.log("  ------------------------------ End of integration tests for mover module\n")
    });

});

