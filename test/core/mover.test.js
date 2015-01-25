var assert = require('assert');
var sinon = require('sinon');
var X = require('x-poser');
var bus = require('hermes-bus');

describe("#################### Starting integration tests for 'mover' module", function() {
   
    var sandbox = sinon.sandbox.create();
    var dummyFunction = function() {};
    var moveToLetterDirStub;
    var mover;
    var emitRegisterDirectorySpy;

    before(function() {
        mover = X.require('./core/mover.js', 'auto');
        bus.onEvent('core', 'registerDirectory', dummyFunction);
    });

    before(function() {
        moveToLetterDirStub = sandbox.stub(mover.self, 'moveToLetterDir');
        emitRegisterDirectorySpy = sandbox.spy(bus.core, "emitRegisterDirectory");
    });

    describe('register empty directory to AlphabetFs', function() {

        var targetDir = "test/target/dir";
        var content = {allPaths: []};

        before(function() {
            emitRegisterDirectorySpy.withArgs(targetDir)
            bus.core.emitMoveToAlphabetDirs(targetDir, content);
        });

        it("should not invoke moveToLetterDir", function() {
            assert.equal(moveToLetterDirStub.called, false);
        });

        it("should invoke  'bus.core.emitRegisterDirectory' once and with right argument", function() {
            assert(emitRegisterDirectorySpy.withArgs(targetDir).calledOnce);
        });

        after(function() {
            emitRegisterDirectorySpy.reset();
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

    describe('emit "MoveToLetterDir" bus.core event', function() {
        var fs = require('fs-extra');
        var rmdir = require('rimraf');
        var lstatSyncStub;
        var fsCopyStub;
        var fsCopyCb;
        var rmdirStub;
        var fsRenameStub;
        var filename = "filename";
        var dirname = "dirname";
        var targetDir = "targetDir";

        //setting up stubs
        before(function() {
            lstatSyncStub = sandbox.stub(fs, 'lstatSync'), function() {
                return {}
            };
            lstatSyncStub.withArgs(targetDir + '/' + filename).returns({isDirectory: function() {
                    return false;
                }});
            lstatSyncStub.withArgs(targetDir + '/' + dirname).returns({isDirectory: function() {
                    return true;
                }});

            fsCopyStub = sandbox.stub(fs, "copy");
            rmdirStub = sandbox.stub(rmdir, "sync");
            fsRenameStub = sandbox.stub(fs, "rename");
        });


        describe('for moving a file', function() {

            before(function() {
                bus.core.emitMoveToLetterDir(targetDir, filename);
            });

            it("should invoke fsRenameStub once", function() {
                assert(fsRenameStub.calledOnce);
            });

            it("should invokefsRenameStub with the right arguments ", function() {
                assert(fsRenameStub.calledWith(targetDir + '/' + filename, targetDir + '/F/' + filename));
            });

        });

        describe('for moving a directory', function() {

            before(function() {
                bus.core.emitMoveToLetterDir(targetDir, dirname);
            });

            it("should invoke fsCopyStub once", function() {
                assert(fsRenameStub.calledOnce);
            });

            it("should fsCopyStub with the right arguments ", function() {
                assert(fsCopyStub.calledWith(targetDir + '/' + dirname, targetDir + '/D/' + dirname));
            });

            describe("invoke fsCopyStub callback", function() {

                before(function() {
                    fsCopyCb = fsCopyStub.args[0][2];
                    fsCopyCb();
                });

                it("should invoke rmdirStub once", function() {
                    assert(fsCopyStub.calledOnce);
                });

                it("should rmdirStub with the right arguments ", function() {
                    assert(fsCopyStub.calledWith(targetDir + '/' + dirname));
                });

            });
        });
    });

    after(function() {
        sandbox.restore();
        bus.hardReset();
        console.log("  ------------------------------ End of integration tests for 'mover' module\n")
    });
    
});