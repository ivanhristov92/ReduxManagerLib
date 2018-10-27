import selectorsFactory from "../crud-selectors";
var assert = require("assert");
import * as _ from "ramda";
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
        });
      });

      describe("[RETURNS] an object with selectors", () => {
        it("[CORRECT TYPE] returns an object", () => {
          assert.equal(typeof selectorsFactory(), "object");
          assert.equal(Array.isArray(selectorsFactory()), false);
          assert.notEqual(selectorsFactory(), null);
        });

        ["getOne", "getSome", "getAll"].forEach(method => {
          it(`[CORRECT TYPE] has a ${method} function`, () => {
            assert.equal(typeof selectorsFactory()[method], "function");
          });
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", () => {
    ["getOne", "getSome", "getAll"].forEach(method => {
      describe(method, () => {
        describe("[EXPECTS]", () => {
          describe("state as 0th argument", () => {
            it("[ACCEPTS] an object with 'byId' and 'isFetching'", () => {
              const selectors = selectorsFactory();
              assert.doesNotThrow(function() {
                selectors[method]({ byId: {}, isFetching: false });
              }, Error);
            });
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
              { isFetching: true },
              { isFetching: "", byId: {} },
              { isFetching: true, byId: [] },
              "test",
              []
            ].forEach((value, index) => {
              it(`${index} [CALLS] the 'customErrorHandler' when 'state' is a ${typeof value} : ${value}`, () => {
                let options = { customErrorHandler: function() {} };
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
                let options = { customErrorHandler: function() {} };
                const selectors = selectorsFactory(options);
                let fallbackValue = selectors[method](value);
                assert.notEqual(typeof fallbackValue, "undefined");
              });
            });
          });
        });
      });
    });
  });

  describe("[OPERATION]", () => {
    ["getOne", "getSome", "getAll"].forEach(method => {
      describe(method, () => {
        it("[CALLS] the custome error handler", () => {});
      });
    });
  });
});
