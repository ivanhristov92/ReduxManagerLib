import { bindSelectorsToState } from "../utils/bind-selectors-to-state";
import actionCreatorsFactory from "../crud-action-creators";
var assert = require("assert");
var sinon = require("sinon");

describe("CRUD Action Creators", () => {
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

      describe("[1] selectors", () => {});
    });
    describe("[RETURNS]", function() {});
  });

  describe("[OPERATION]", () => {});
});
