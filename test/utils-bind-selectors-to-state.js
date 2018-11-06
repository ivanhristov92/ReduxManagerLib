import { bindSelectorsToState } from "../utils/bind-selectors-to-state";
var assert = require("assert");
var sinon = require("sinon");

describe("UTILS bindSelectorsToState", () => {
  describe("[EXPORTS] a function", function() {
    it("The module should name export a function", () => {
      assert.equal(typeof bindSelectorsToState, "function");
    });
  });

  describe("[RUNTIME SIGNATURE]", function() {
    describe("[EXPECTS]", function() {
      describe("[0] subStateGetter - non-empty string or a function", () => {
        it(`[ACCEPTS][CORRECT TYPE] a non-empty string`, () => {
          assert.doesNotThrow(function() {
            bindSelectorsToState("non-empty", {});
          });
        });

        it(`[ACCEPTS][CORRECT TYPE] a function`, () => {
          assert.doesNotThrow(function() {
            bindSelectorsToState(function() {}, {});
          });
        });

        [[], "", null, false, true, 100, 0, {}].forEach((value, index) => {
          it(`${index} [THROWS] throws a ModuleInitializationTypeError if 'subStateGetter' is not a string or a function , but ${typeof value} : ${value}`, () => {
            try {
              bindSelectorsToState(value, {});
              throw new Error("should have thrown");
            } catch (err) {
              assert.equal(err.name, "ModuleInitializationTypeError");
            }
          });
        });
      });

      describe("[1] selectors", () => {
        it(`[ACCEPTS][CORRECT TYPE] an object`, () => {
          assert.doesNotThrow(function() {
            bindSelectorsToState("non-empty", {});
          });
        });

        [[], "", null, false, true, 100, 0, function() {}, undefined].forEach(
          (value, index) => {
            it(`${index} [THROWS] throws a ModuleInitializationTypeError if 'selectors' is not an object, but ${typeof value} : ${value}`, () => {
              try {
                bindSelectorsToState(value, value);
                throw new Error("should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          }
        );
      });
    });
    describe("[RETURNS]", function() {
      let regularSelectors = {
        selector(state) {
          if (!state) {
            throw new TypeError();
          }
          return state.test;
        }
      };
      let boundSelectors = bindSelectorsToState("testState", regularSelectors);

      it("[CORRECT TYPE] object", () => {
        assert.equal(typeof boundSelectors, "object");
      });

      it("[CORRECT VALUE] has the selector", () => {
        assert.equal(typeof boundSelectors.selector, "function");
      });
    });
  });

  describe("[OPERATION]", () => {
    let state = { testState: { test: true } };

    let regularSelectors = {
      selector(state) {
        if (!state.test) {
          throw new TypeError();
        }
        return state.test;
      },
      nested: {
        selector(state) {
          if (!state.test) {
            throw new TypeError();
          }
          return state.test;
        }
      }
    };
    let boundSelectors = bindSelectorsToState("testState", regularSelectors);

    it("gets the state", () => {
      assert.doesNotThrow(() => {
        boundSelectors.selector(state);
        boundSelectors.nested.selector(state);
      }, Error);
    });

    it("returns the correct value", () => {
      let value = boundSelectors.selector(state);
      let valueFromNested = boundSelectors.nested.selector(state);
      assert.equal(value, true);
      assert.equal(valueFromNested, true);
    });
  });
});
