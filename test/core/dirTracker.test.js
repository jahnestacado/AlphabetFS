var assert = require('assert');
var sinon = require('sinon');
var bus = require('hermes-bus');
var hound = require('hound');

describe("#################### Starting integration tests for 'dirTracker' module", function() {
    var sandbox = sinon.sandbox.create();
    var dummyFunction = function() {};
    var targetDirPath1 = "foo/bar";

    before(function() {
        bus.subscribeEventsFrom("./src/core/dirTracker.js");
        bus.onEvent("socket", "UIEvent", dummyFunction);
        bus.onEvent("db", "storePath", dummyFunction);
    });

    var emitStorePathSpy
    var emitUIEventSpy;
    var watchSpy;
    var unwatchSpy;
    before(function() {
        watchSpy = sandbox.spy();
        unwatchSpy = sandbox.spy();
        var houndWatchStub = sandbox.stub(hound, "watch").withArgs(targetDirPath1).returns({
            on: watchSpy,
            unwatch: unwatchSpy
        });
        emitStorePathSpy = sandbox.spy(bus.db, "emitStorePath");
        emitStorePathSpy.withArgs(targetDirPath1);
        emitUIEventSpy = sandbox.spy(bus.socket, "emitUIEvent")
        emitUIEventSpy.withArgs("register-path", targetDirPath1);
    });

    describe("when emitting 'registerDirectory' message on the core busline", function() {

        before(function() {
            bus.core.emitRegisterDirectory(targetDirPath1);
        });

        it("should invoke 'emitStorePathSpy' once and  with right argument", function() {
            assert(emitStorePathSpy.withArgs(targetDirPath1).calledOnce);
        });

        it("should invoke 'emitUIEventSpy' once and with right arguments", function() {
            assert(emitUIEventSpy.withArgs("register-path", targetDirPath1).calledOnce);
        });

        describe("when folder/file is created/moved in the registered directory", function() {
            before(function() {
                watchSpy.withArgs("create");
            });

            it("should invoke 'watcher' once with 'create' as first argument", function() {
                assert(watchSpy.withArgs("create").calledOnce);
            });

            describe("when invoking the 'watcher' callback for the 'create' message ", function() {
                var houndWatcherOnCreateCallback;
                var snitch;

                before(function() {
                    snitch = require('snitch');
                });

                var snitchOnStopGrowingStub;
                before(function() {
                    emitUIEventSpy.withArgs("start-blinking", targetDirPath1);
                    snitchOnStopGrowingStub = sandbox.stub(snitch, "onStopGrowing");
                });

                before(function() {
                    houndWatcherOnCreateCallback = watchSpy.withArgs("create").args[0][1];
                });

                describe("when this folder/file is not a direct child of the targetDir ", function() {
                    var notDirectchildDirectory = targetDirPath1 + "/baz/echo";
                    before(function() {
                        houndWatcherOnCreateCallback(notDirectchildDirectory);
                    });

                    it("should not invoke 'emitUIEventSpy' with 'start-blinking' message and" + targetDirPath1 + " arguments", function() {
                        assert.equal(emitUIEventSpy.withArgs("start-blinking", targetDirPath1).calledOnce, false);
                    });

                    it("should not invoke 'snitchOnStopGrowingStub'", function() {
                        assert.equal(snitchOnStopGrowingStub.calledOnce, false);
                    });

                });

                describe("when this folder/file is direct child of the targetDir ", function() {
                    var directChildDirectory = targetDirPath1 + "/baz";
                    before(function() {
                        houndWatcherOnCreateCallback(directChildDirectory);
                    });

                    it("should invoke 'emitUIEventSpy' with 'start-blinking' message and" + targetDirPath1 + " arguments once", function() {
                        assert(emitUIEventSpy.withArgs("start-blinking", targetDirPath1).calledOnce);
                    });

                    it("should invoke 'snitchOnStopGrowingStub' once", function() {
                        assert(snitchOnStopGrowingStub.calledOnce);
                    });

                    it("should invoke 'snitchOnStopGrowingStub' with '" + directChildDirectory + "' as first argument", function() {
                        assert.equal(snitchOnStopGrowingStub.args[0][0], directChildDirectory);
                    });

                    describe("when callback of 'snitchOnStopGrowing' is invoked", function() {

                        before(function() {
                            bus.onEvent("core", "moveToLetterDir", dummyFunction);
                        });

                        var fsArtifactName = "baz";
                        var emitMoveToLetterDirSpy;
                        before(function() {
                            emitMoveToLetterDirSpy = sandbox.spy(bus.core, "emitMoveToLetterDir")
                            emitMoveToLetterDirSpy.withArgs(targetDirPath1, fsArtifactName);
                            emitUIEventSpy.withArgs("stop-blinking", targetDirPath1);
                        });

                        var snitchOnStopGrowingCallback;
                        before(function() {
                            snitchOnStopGrowingCallback = snitchOnStopGrowingStub.args[0][1];
                            snitchOnStopGrowingCallback(directChildDirectory);
                        });

                        it("should invoke 'emitMoveToLetterDirSpy' once with right arguments ", function() {
                            assert(emitMoveToLetterDirSpy.withArgs(targetDirPath1, fsArtifactName).calledOnce);
                        });

                        it("should invoke 'emitUIEventSpy' once with right arguments ", function() {
                            assert(emitUIEventSpy.withArgs("stop-blinking", targetDirPath1).calledOnce);
                        });

                    });
                });
            });
        });
    });

    describe("when deleting a registered path from db", function() {

        describe("when the path is from the same function scope ('registerDirectory')", function() {
            before(function() {
                unwatchSpy.withArgs(targetDirPath1);
                bus.db.emitDeletePath(targetDirPath1);
            });

            it("should invoke 'unwatchSpy' once with the right argument", function() {
                assert(unwatchSpy.withArgs(targetDirPath1).calledOnce);
            });
        });

        describe("when the path is not from the same function scope ('registerDirectory')", function() {
            var path = "foo/baz";
            before(function() {
                unwatchSpy.withArgs(path);
                bus.db.emitDeletePath(path);
            });

            it("should invoke 'unwatchSpy' once with the right argument", function() {
                assert.equal(unwatchSpy.withArgs(path).calledOnce, false);
            });
        });

    });
    
    after(function() {
        sandbox.restore();
        bus.hardReset();
        console.log("  ------------------------------ End of integration tests for 'dirTracker' module\n")
    });
    
});