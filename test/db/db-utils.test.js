var assert = require('assert');
var sinon = require('sinon');
var utils = require("./../utils.js");
var bus = require('hermes-bus');
var config = require('./../../db/db-config.js');
var X = require('x-poser')
var db = require('riak-js');



describe("#################### Starting integration tests for db-utils module\n", function() {

    var dbGet = sinon.stub();
    var dbSave = sinon.stub();
    var dbExists = sinon.stub();

    sinon.stub(db, "getClient", function() {
        return {
            get: dbGet,
            save: dbSave,
            exists: dbExists
        }
    });



    describe("uppon 'manual' initialization", function() {

    var dbUtils = X.require('./db/db-utils.js', 'auto');
        var expectedField1 = {
            bucket: "dummy-bucket1",
            key: "dummy-key1",
            initialValue: "dummy-value1"
        };

        var expectedField2 = {
            bucket: "dummy-bucket2",
            key: "dummy-key2",
            initialValue: "dummy-value2"
        };

        var fields = [expectedField1, expectedField2];

        /*
         * Stubs have been already invoked during initialization of dbUtils
         * so we reset them in order to trigger the same functionality manually 
         * and test it with alternative db-fields
         */
        before(function() {
            dbSave.reset();
            dbExists.reset();
            dbUtils.init(fields);
        });

        it("should invoke db.exists twice", function() {
            assert(dbExists.calledTwice);
        });


        describe("on db.exists ", function() {

            var dbExistsCallback;
            before(function() {
                // Capturing dbExists callback of first invocation
                dbExistsCallback = dbExists.args[0][2];
            });

            it("should have been invoked with arguments '" + expectedField1.bucket + ", " + expectedField1.key + "'", function() {
                assert(dbExists.calledWith(expectedField1.bucket, expectedField1.key));

            });

            it("should have been invoked with arguments '" + expectedField2.bucket + ", " + expectedField2.key + "'", function() {
                assert(dbExists.calledWith(expectedField2.bucket, expectedField2.key));

            });

            describe("on db-exists callback with path that already exists", function() {

                before(function() {
                    dbExistsCallback(null, true)
                });

                it("should have not invoked db.save", function() {
                    assert.equal(dbSave.called, false);
                });

            });

            describe("on db-exists callback with path that doesn't exists", function() {

                before(function() {
                    dbExistsCallback(null, false)
                });

                it("should have  invoked db.save once", function() {
                    assert(dbSave.calledOnce);
                });

                it("should have bee  invoked with the right arguments", function() {
                    assert(dbSave.calledWithExactly(expectedField1.bucket, expectedField1.key, expectedField1.initialValue));
                });

            });

        });

        after(function() {
            dbSave.reset();
            dbExists.reset();
        })
    });

    describe("testing bus events related to path entries in database", function() {

        var pathsStoreObject = {
            bucket: "abc-fs",
            key: "registered-paths",
        };

        describe("emit on db-busline 'onDataGet' event", function() {
            var expectedArg1 = pathsStoreObject.bucket;
            var expectedArg2 = pathsStoreObject.key;
            var expectedArg3 = sinon.spy();


            var args;
            before(function() {
                bus.db.emitOnDataGet(expectedArg1, expectedArg2, expectedArg3);
                args = dbGet.args[ 0];
            });

            it("should invoke db.get once", function() {
                assert(dbGet.calledOnce);
            });

            it("should have for first argument a string with value equal to '" + expectedArg1 + "'", function() {
                assert.equal(expectedArg1, args[0]);
            });

            it("should have for second argument a string with value equal to '" + expectedArg2 + "'", function() {
                assert.equal(expectedArg2, args[1]);
            });

            describe("onDataGetCallback", function() {

                before(function() {
                    var onDataGetCallback = dbGet.args[0][2];
                    onDataGetCallback();
                });

                it("should invoke callback function once", function() {
                    assert(expectedArg3.calledOnce);
                });

            });

            after(function() {
                dbGet.reset();
                dbSave.reset();
            })
        });

        describe("emit on db-busline 'deletePath' event", function() {

            var testPath = "foo";
            var expectedArg1 = pathsStoreObject.bucket;
            var expectedArg2 = pathsStoreObject.key;

            before(function() {
                bus.db.emitDeletePath(testPath);
            });

            it("should invoke db.get once", function() {
                assert(dbGet.calledOnce);
            });

            describe("db.get", function() {

                var dbGetArgs;
                before(function() {
                    dbGetArgs = dbGet.args[0];
                });

                it("should have been invoked with  '" + expectedArg1 + ", " + expectedArg2 + "", function() {
                    assert(dbGet.calledWith(expectedArg1, expectedArg2));
                });

                it("should have for third argument a function", function() {
                    assert(typeof dbGetArgs[2] === "function");
                });


                describe("on  deletePath db.get callback invocation", function() {
                    var dummyPaths = [testPath, "bar", "baz"];

                    before(function() {
                        var onDeleteCb = dbGetArgs[2];
                        onDeleteCb(null, dummyPaths);
                    });

                    it("should invoke db.save once", function() {
                        assert(dbSave.calledOnce);
                    });

                    describe("on db.save ", function() {
                        var args;
                        var expectedArg3 = ["bar", "baz"];
                        before(function() {
                            args = dbSave.args[0];
                        });

                        it("should have for first argument a string with value equal to '" + expectedArg1 + "'", function() {
                            assert.equal(args[0], expectedArg1);
                        });

                        it("should have for second argument a string with value equal to '" + expectedArg2 + "'", function() {
                            assert.equal(args[1], expectedArg2);
                        });

                        it("should have for third argument an array with value equal to '" + expectedArg3 + "'", function() {
                            assert.equal(utils.areArrayContentsEqual(args[2], expectedArg3), true);
                        });
                    });
                });

                after(function() {
                    dbGet.reset();
                    dbSave.reset();
                });
            });
        });


        describe("emit on db-busline 'storePath' event", function() {

            var testPath = "foo";
            var expectedArg1 = pathsStoreObject.bucket;
            var expectedArg2 = pathsStoreObject.key;

            before(function() {
                bus.db.emitStorePath(testPath);
            });

            it("should invoke db.get once", function() {
                assert(dbGet.calledOnce);
            });

            describe("db.get", function() {

                var dbGetArgs;
                before(function() {
                    dbGetArgs = dbGet.args[0];
                });

                it("should have been invoked with  '" + expectedArg1 + ", " + expectedArg2 + "", function() {
                    assert(dbGet.calledWith(expectedArg1, expectedArg2));
                });

                it("should have for third argument a function", function() {
                    assert(typeof dbGetArgs[2] === "function");
                });


                describe("on storePath db.get callback invocation with path that already exists", function() {
                    var dummyPaths = [testPath, "bar", "baz"];
                    var onStorePathCb;
                    before(function() {
                        onStorePathCb = dbGetArgs[2];
                        onStorePathCb(null, dummyPaths);
                    });

                    it("should not invoke db.save", function() {
                        assert.equal(dbSave.called, false);
                    });

                    describe("on storePath db.get callback invocation with path that doesn't exist", function() {
                        var dummyPaths = ["bar", "baz"];

                        before(function() {
                            onStorePathCb(null, dummyPaths);
                        });

                        it("should invoke db.save once", function() {
                            assert(dbSave.calledOnce);
                        });

                        describe("on db.save ", function() {
                            var cbArgs;
                            var expectedArg3 = ["bar", "baz", testPath];
                            before(function() {
                                cbArgs = dbSave.args[0];
                            });

                            it("should have for first argument a string with value equal to '" + expectedArg1 + "'", function() {
                                assert.equal(cbArgs[0], expectedArg1);
                            });

                            it("should have for second argument a string with value equal to '" + expectedArg2 + "'", function() {
                                assert.equal(cbArgs[1], expectedArg2);
                            });
                            it("should have for third argument an array with value equal to '" + expectedArg3 + "'", function() {
                                assert.equal(utils.areArrayContentsEqual(cbArgs[2], expectedArg3), true);
                            });
                        });
                    });
                });

                after(function() {
                    dbGet.reset();
                    dbSave.reset();
                });
            });
        });

    });
    after(function() {
        db.getClient.restore();
        console.log("  ------------------------------ End of integration tests for db-utils module\n")
    });
});