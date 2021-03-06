import selectorsFactory from "../crud-selectors";
var assert = require("assert");
var sinon = require("sinon");

describe("CRUD SELECTORS", () => {
  describe("[EXPORTS]", () => {
    it("selectorsFactory function", () => {
      assert.equal(typeof selectorsFactory, "function");
    });
  });

  describe("[MODULE INITIALIZATION SIGNATURE]", () => {
    describe("selectorsFactory", () => {
      describe("[EXPECTS] an options object", () => {
        describe("[ACCEPTS] does not throw, when passed an options object", () => {
          it("[CORRECT TYPE] {}", () => {
            assert.doesNotThrow(function() {
              selectorsFactory({});
            }, Error);
          });
          it("[CORRECT TYPE] undefined", () => {
            assert.doesNotThrow(function() {
              selectorsFactory(undefined);
            }, Error);
          });

          it("[CORRECT TYPE] options.customErrorHandler function", () => {
            assert.doesNotThrow(function() {
              selectorsFactory({ customErrorHandler: function() {} });
            }, Error);
          });
          it("[CORRECT TYPE] options.additional object", () => {
            assert.doesNotThrow(function() {
              selectorsFactory({ additional: { method: function() {} } });
            }, Error);
          });
        });

        describe("[THROWS] a ModuleInitializationTypeError", () => {
          [null, false, true, Error, function() {}, []].forEach(value => {
            it(`[THROWS] when passed a ${typeof value}: ${value}`, () => {
              try {
                selectorsFactory(value);
                assert.equal(false, true, "Should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          });

          [null, false, true, "", "test", []].forEach(value => {
            it(`[THROWS] when customErrorHandler is not a function, but a ${typeof value}: ${value}`, () => {
              try {
                selectorsFactory({ customErrorHandler: value });
                assert.equal(false, true, "Should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          });

          [null, false, true, "", "test", [], function() {}].forEach(value => {
            it(`[THROWS] when 'additional' is not an object, but a ${typeof value}: ${value}`, () => {
              try {
                selectorsFactory({ additional: value });
                assert.equal(false, true, "Should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          });

          [null, false, true, "", "test", []].forEach(value => {
            it(`[THROWS] when 'additional' contains other than functions - ${typeof value}: ${value}`, () => {
              try {
                selectorsFactory({ additional: { method: value } });
                assert.equal(false, true, "Should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          });
        });
      });

      describe("[RETURNS] an object with selectors", () => {
        it("[CORRECT TYPE] returns an object", () => {
          assert.equal(typeof selectorsFactory(), "object");
          assert.equal(Array.isArray(selectorsFactory()), false);
          assert.notEqual(selectorsFactory(), null);
        });

        [
          "getOne",
          "getSome",
          "getAll",
          "getError",
          "getOperationStates"
        ].forEach(method => {
          it(`[CORRECT TYPE] has a ${method} function`, () => {
            assert.equal(typeof selectorsFactory()[method], "function");
          });
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", () => {
    function testStateArgument(method, ...methodArgs) {
      describe("state as 0th argument", () => {
        it("[ACCEPTS] an object with 'byId' and 'isFetching'", () => {
          let options = {
            customErrorHandler: function() {}
          };
          sinon.spy(options, "customErrorHandler");
          const selectors = selectorsFactory(options);

          assert.doesNotThrow(function() {
            selectors[method]({ byId: {}, isFetching: false }, ...methodArgs);
          }, Error);
        });

        describe(`[THROWS][HANDLES] when 'state' is not an object`, () => {
          [
            null,
            false,
            true,
            Error,
            function() {},
            {},
            { byId: {} },
            { byId: [] },
            { create: "", read: "" },
            "test",
            []
          ].forEach((value, index) => {
            it(`${index} [CALLS] the 'customErrorHandler' when 'state' is a ${typeof value} : ${value}`, () => {
              let options = {
                customErrorHandler: function() {}
              };
              sinon.spy(options, "customErrorHandler");
              const selectors = selectorsFactory(options);

              selectors[method](value);
              let errorCall = options.customErrorHandler.getCall(0);
              assert.notEqual(errorCall, null);
            });
          });
        });

        describe(`[HANDLES][RETURNS] when 'state' is not an object a default value is returned`, () => {
          [
            null,
            false,
            true,
            Error,
            function() {},
            {},
            { byId: {} },
            { byId: [] },
            { isFetching: true },
            { isFetching: "", byId: {} },
            { isFetching: true, byId: [] },
            "test",
            []
          ].forEach((value, index) => {
            it(`${index} Method ${method} returns a default value, when an error occurs`, () => {
              let options = {
                customErrorHandler: function() {}
              };
              const selectors = selectorsFactory(options);
              let fallbackValue = selectors[method](value);
              assert.notEqual(typeof fallbackValue, "undefined");
            });
          });
        });
      });
    }

    describe("getOne", () => {
      describe("[EXPECTS]", () => {
        testStateArgument("getOne", "testId");
        describe("'id' for argument 1", () => {
          describe("[ACCEPTS]", () => {
            it("[ACCEPTS] a non-empty string", () => {
              let options = { customErrorHandler() {} };
              sinon.spy(options, "customErrorHandler");
              assert.doesNotThrow(function() {
                selectorsFactory().getOne(
                  { byId: {}, create: "", read: "", update: "", delete: "" },
                  "non-empty"
                );
              });
              const errorHandlerCall = options.customErrorHandler.getCall(0);
              assert.equal(errorHandlerCall, null);
            });
            it("[ACCEPTS] a number", () => {
              let options = { customErrorHandler() {} };
              sinon.spy(options, "customErrorHandler");
              assert.doesNotThrow(function() {
                selectorsFactory().getOne(
                  { byId: {}, create: "", read: "", update: "", delete: "" },
                  22
                );
              });
              const errorHandlerCall = options.customErrorHandler.getCall(0);
              assert.equal(errorHandlerCall, null);
            });
          });

          describe("[THROWS][HANDLES]", () => {
            [
              Boolean,
              function() {},
              "",
              false,
              null,
              undefined,
              {},
              []
            ].forEach((value, index) => {
              it(`${index} [THROWS][HANDLES] when the id is not a non-empty string or a number, but a ${typeof value}: ${value}`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getOne(
                    { byId: {}, isFetching: false },
                    value
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.notEqual(errorHandlerCall, null);
              });
            });
          });
        });
      });

      describe("[RETURNS]", () => {
        it("[CORRECT VALUE] it returns the selected entry by a string id", () => {
          let selectors = selectorsFactory({ customErrorHandler() {} });
          let testEntry = { id: "test" };
          let state = {
            byId: { test: testEntry },
            create: "",
            read: "",
            update: "",
            delete: ""
          };
          let id = "test";
          let returnValue = selectors.getOne(state, id);
          assert.deepEqual(returnValue, testEntry);
        });

        it("[CORRECT VALUE] it returns the selected entry by a number id", () => {
          let selectors = selectorsFactory({ customErrorHandler() {} });
          let testEntry = { id: 222 };
          let state = {
            byId: { 222: testEntry },
            create: "",
            read: "",
            update: "",
            delete: ""
          };
          let id = 222;
          let returnValue = selectors.getOne(state, id);
          assert.deepEqual(returnValue, testEntry);
        });

        it("[CORRECT VALUE][CORRECT TYPE] when an error occurs it returns an {}", () => {
          let selectors = selectorsFactory({ customErrorHandler() {} });
          let testEntry = { id: 222 };
          let state = { byId: { 222: testEntry }, isFetching: false };
          let id = 222;
          let returnValue = selectors.getOne(state, false);

          assert.equal(typeof returnValue, "object");
          assert.equal(Array.isArray(returnValue), false);
          assert.deepEqual(returnValue, {});
        });
      });
    });

    describe("getSome", () => {
      describe("[EXPECTS]", () => {
        testStateArgument("getSome");
        describe("'ids' for argument 1", () => {
          describe("[ACCEPTS]", () => {
            it("[ACCEPTS] a non-empty array of strings or numbers", () => {
              let options = { customErrorHandler() {} };
              sinon.spy(options, "customErrorHandler");
              assert.doesNotThrow(function() {
                selectorsFactory(options).getSome(
                  {
                    byId: {},
                    create: "",
                    read: "",
                    update: "",
                    delete: ""
                  },
                  [1, "non empty"]
                );
              });
              const errorHandlerCall = options.customErrorHandler.getCall(0);
              assert.equal(errorHandlerCall, null);
            });
          });

          describe("[THROWS][HANDLES]", () => {
            [
              Boolean,
              function() {},
              "",
              false,
              null,
              undefined,
              {},
              [Boolean, false, 22, ""],
              [Boolean],
              [false],
              [""]
            ].forEach((value, index) => {
              it(`${index} [THROWS][HANDLES] when the ids are not valid ids and not in an array, but a ${typeof value}: ${value}`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getSome(
                    { byId: {}, isFetching: false },
                    value
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.notEqual(errorHandlerCall, null);
              });
            });
          });
        });
        describe("'format' as last argument", () => {
          describe("[ACCEPTS]", () => {
            ["map", "array", undefined].forEach(format => {
              it(`[CORRECT VALUE] '${format}'`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getSome(
                    {
                      byId: {},
                      create: "",
                      read: "",
                      update: "",
                      delete: ""
                    },
                    ["non-empty id"],
                    format
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.equal(errorHandlerCall, null);
              });
            });
          });
          describe("[THROWS][HANDLES]", () => {
            [
              Boolean,
              function() {},
              "",
              false,
              null,
              {},
              [Boolean, false, 22, ""],
              [Boolean],
              [false],
              [""]
            ].forEach((format, index) => {
              it(`${index} [THROWS][HANDLES] when instead of "map" or "array" it receives ${typeof format}: ${format}`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getSome(
                    { byId: {}, isFetching: false },
                    ["someId"],
                    format
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.notEqual(errorHandlerCall, null);
              });
            });
          });
        });
      });

      describe("[RETURNS]", () => {
        [undefined, "array"].forEach(format => {
          describe(`when format === ${format} is passed`, () => {
            let selectors = selectorsFactory({ customErrorHandler() {} });
            let testEntry1 = { id: 111 };
            let testEntry2 = { id: 222 };
            let state = {
              byId: { 111: testEntry1, 222: testEntry2 },
              create: "",
              read: "",
              update: "",
              delete: ""
            };
            let ids = [111, 222];
            let returnValue = selectors.getSome(state, ids, format);
            it(`[CORRECT TYPE] it returns an array of entries, when 'format === ${format}' is passed`, () => {
              assert.equal(Array.isArray(returnValue), true);
            });
            it(`[CORRECT VALUE] correctly returns an array of entries, when no 'format === ${format}' is passed`, () => {
              assert.deepEqual(returnValue, [testEntry1, testEntry2]);
            });

            it(`[CORRECT VALUE][CORRECT TYPE] when 'format === ${format}' and an error occurs it returns an []`, () => {
              let returnValue = selectors.getSome(state, null, format);
              assert.equal(Array.isArray(returnValue), true);
              assert.deepEqual(returnValue, []);
            });
          });
        });

        describe(`when format === map is passed`, () => {
          let selectors = selectorsFactory({ customErrorHandler() {} });
          let testEntry1 = { id: 111 };
          let testEntry2 = { id: 222 };
          let state = {
            byId: { 111: testEntry1, 222: testEntry2 },
            create: "",
            read: "",
            update: "",
            delete: ""
          };
          let ids = [111, 222];
          let returnValue = selectors.getSome(state, ids, "map");
          it("[CORRECT TYPE] it returns an array of entries, when 'format === map' is passed", () => {
            assert.equal(
              typeof returnValue === "object" && !Array.isArray(returnValue),
              true
            );
          });
          it("[CORRECT VALUE] correctly returns an array of entries, when 'format === map' is passed", () => {
            assert.deepEqual(returnValue, { 111: testEntry1, 222: testEntry2 });
          });

          it("[CORRECT VALUE][CORRECT TYPE] when 'format === map' and an error occurs it returns an {}", () => {
            let returnValue = selectors.getSome(state, null, "map");
            assert.equal(typeof returnValue, "object");
            assert.equal(Array.isArray(returnValue), false);
            assert.deepEqual(returnValue, {});
          });
        });
      });
    });

    describe("getAll", () => {
      describe("[EXPECTS]", () => {
        testStateArgument("getAll");
        describe("'format' as last argument", () => {
          describe("[ACCEPTS]", () => {
            ["map", "array", undefined].forEach(format => {
              it(`[CORRECT VALUE] '${format}'`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getAll(
                    {
                      byId: {},
                      create: "",
                      read: "",
                      update: "",
                      delete: ""
                    },
                    format
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.equal(errorHandlerCall, null);
              });
            });
          });
          describe("[THROWS][HANDLES]", () => {
            [
              Boolean,
              function() {},
              "",
              false,
              null,
              {},
              [Boolean, false, 22, ""],
              [Boolean],
              [false],
              [""]
            ].forEach((format, index) => {
              it(`${index} [THROWS][HANDLES] when instead of "map" or "array" it receives ${typeof format}: ${format}`, () => {
                let options = { customErrorHandler() {} };
                sinon.spy(options, "customErrorHandler");
                assert.doesNotThrow(function() {
                  selectorsFactory(options).getAll(
                    { byId: {}, isFetching: false },
                    format
                  );
                });
                const errorHandlerCall = options.customErrorHandler.getCall(0);
                assert.notEqual(errorHandlerCall, null);
              });
            });
          });
        });
      });

      describe("[RETURNS]", () => {
        [undefined, "array"].forEach(format => {
          describe(`when format === ${format} is passed`, () => {
            let selectors = selectorsFactory({ customErrorHandler() {} });
            let testEntry1 = { id: 111 };
            let testEntry2 = { id: 222 };
            let state = {
              byId: { 111: testEntry1, 222: testEntry2 },
              create: "",
              read: "",
              update: "",
              delete: ""
            };
            let returnValue = selectors.getAll(state, format);
            it(`[CORRECT TYPE] it returns an array of entries, when 'format === ${format}' is passed`, () => {
              assert.equal(Array.isArray(returnValue), true);
            });
            it(`[CORRECT VALUE] correctly returns an array of entries, when 'format === ${format}' is passed`, () => {
              assert.deepEqual(returnValue, [testEntry1, testEntry2]);
            });

            it(`[CORRECT VALUE][CORRECT TYPE] when 'format === ${format}' and an error occurs it returns an {}`, () => {
              let returnValue = selectors.getAll({}, format);
              assert.equal(Array.isArray(returnValue), true);
              assert.deepEqual(returnValue, []);
            });
          });
        });

        describe(`when format === map is passed`, () => {
          let selectors = selectorsFactory({ customErrorHandler() {} });
          let testEntry1 = { id: 111 };
          let testEntry2 = { id: 222 };
          let state = {
            byId: { 111: testEntry1, 222: testEntry2 },
            create: "",
            read: "",
            update: "",
            delete: ""
          };
          let returnValue = selectors.getAll(state, "map");
          it("[CORRECT TYPE] it returns an array of entries, when 'format === map' is passed", () => {
            assert.equal(
              typeof returnValue === "object" && !Array.isArray(returnValue),
              true
            );
          });
          it("[CORRECT VALUE] correctly returns an array of entries, when 'format === map' is passed", () => {
            assert.deepEqual(returnValue, { 111: testEntry1, 222: testEntry2 });
          });

          it("[CORRECT VALUE][CORRECT TYPE] when 'format === map' and an error occurs it returns an {}", () => {
            let returnValue = selectors.getAll({}, "map");
            assert.equal(typeof returnValue, "object");
            assert.equal(Array.isArray(returnValue), false);
            assert.deepEqual(returnValue, {});
          });
        });
      });
    });

    describe("getError", () => {
      describe("[EXPECTS]", () => {
        testStateArgument("getError");
      });

      describe("[RETURNS]", () => {
        let selectors = selectorsFactory({ customErrorHandler() {} });
        let state = {
          byId: {},
          create: "",
          read: "",
          update: "",
          delete: "",
          error: { test: true }
        };
        let returnValue = selectors.getError(state);
        it("[CORRECT TYPE] returns the value of the error prop", () => {
          assert.deepEqual({ test: true }, returnValue);
        });
      });
    });

    describe("getOperationStates", () => {
      describe("[EXPECTS]", () => {
        testStateArgument("getOperationStates");
      });

      describe("[RETURNS]", () => {
        let selectors = selectorsFactory({ customErrorHandler() {} });
        let state = {
          byId: {},
          create: "",
          read: "",
          update: "",
          delete: ""
        };
        let returnValue = selectors.getOperationStates(state);
        it("[CORRECT TYPE] returns an object", () => {
          assert.equal(
            typeof returnValue === "object" && !Array.isArray(returnValue),
            true
          );
        });
        it("[CORRECT VALUE] the object contains 'create', 'read', 'update', 'delete' properties with string values", () => {
          assert.equal(typeof returnValue.create, "string");
          assert.equal(typeof returnValue.read, "string");
          assert.equal(typeof returnValue.update, "string");
          assert.equal(typeof returnValue.delete, "string");
        });
      });
    });
  });

  describe("[OPERATION]", () => {
    describe("'customErrorHandler'", () => {
      ["getOne", "getSome", "getAll"].forEach(function(method) {
        let options = { customErrorHandler() {} };
        sinon.spy(options, "customErrorHandler");
        let selectors = selectorsFactory(options);
        console.log(method);
        const state = false;
        selectors[method](state);
        let errorHandlerCall = options.customErrorHandler.getCall(0);

        it("[CALLS] customErroHandler", () => {
          assert.notEqual(errorHandlerCall, null);
        });

        describe("[CALLS] custommErrorHandler with the right arguments", () => {
          it("[CORRECT TYPE] 0th arg is the Error", () => {
            assert.equal(errorHandlerCall.args[0] instanceof Error, true);
          });

          it("[CORRECT TYPE]1st arg is the 'details' object", () => {
            assert.equal(typeof errorHandlerCall.args[1] === "object", true);
          });
        });
      });
    });
  });
});
