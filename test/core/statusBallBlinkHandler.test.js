var assert = require('assert');
var sinon = require('sinon');
var bus = require('hermes-bus');

describe("'#################### Starting integration tests for 'statusBallBlinkHandler' module'", function() {
    var statusBallBlinkHandle;
    var socketEmitUIEventSpy;
    var sandbox;

    before(function() {
        statusBallBlinkHandler = require('./../../core/statusBallBlinkHandler.js');

        sandbox = sinon.sandbox.create();
        socketEmitUIEventSpy = sandbox.spy(bus.socket, "emitUIEvent");
    });

    describe("testing the emission of UIEvent on 'socket' busline", function() {

        var path = "dummy/path"
        describe("when emitting 'start-blinking' and 'initStatusOfBalls' messages for a path", function() {

            before(function() {
                bus.socket.emitUIEvent("start-blinking", path);
            });

            before(function() {
                socketEmitUIEventSpy.reset();
                bus.socket.emitInitStatusOfBalls();
            });

            it("should invoke 'socketEmitUIEvent' once", function() {
                assert(socketEmitUIEventSpy.calledOnce);
            });

            it("should invoke 'socketEmitUIEvent' with the right arguments", function() {
                assert(socketEmitUIEventSpy.calledWith("start-blinking", path));
            });

            describe("when emitting 'stop-blinking' and 'initStatusOfBalls' messages for the same path", function() {

                before(function() {
                    bus.socket.emitUIEvent("start-blinking", path);
                });

                before(function() {
                    socketEmitUIEventSpy.reset();
                    bus.socket.emitInitStatusOfBalls();
                });

                it("should invoke 'socketEmitUIEvent' only  once again", function() {
                    assert(socketEmitUIEventSpy.calledOnce);
                });

                it("should invoke 'socketEmitUIEvent' with the same arguments again", function() {
                    assert(socketEmitUIEventSpy.calledWith("start-blinking", path));
                });

            })

            describe("when emitting 'stop-blinking' and 'initStatusOfBalls' messages for the path", function() {

                // clear state of spy
                before(function() {
                    socketEmitUIEventSpy.reset();
                });

                before(function() {
                    bus.socket.emitUIEvent("stop-blinking", path);
                    bus.socket.emitInitStatusOfBalls();
                });

                it("should invoke 'socketEmitUIEvent' only once", function() {
                    assert(socketEmitUIEventSpy.calledOnce)
                });


            })
        })

        after(function() {
            socketEmitUIEventSpy.reset();
        });
    })

    describe("setting a path in a blinking state", function() {
        var path = "foo/bar";

        before(function() {
            bus.socket.emitUIEvent("start-blinking", path);
        });

        before(function() {
            socketEmitUIEventSpy.reset();
        });

        describe("when emitting 'deletePath' message on the 'db' busline", function() {

            before(function() {
                bus.db.emitDeletePath(path);
            });

            describe("when emitting 'initStatusOfBalls'' message on the 'socket' busline", function() {

                it("should not invoke the socketEmitUIEventSpy function", function() {
                    assert(!socketEmitUIEventSpy.called);
                });

            });

        })

        after(function() {
            socketEmitUIEventSpy.reset();
        });

    })

    after(function() {
        sandbox.restore();
        bus.hardReset();
        console.log("  ------------------------------ End of integration tests for 'statusBallBlinkHandler' module\n")
    });

});