import { bindSelectorsToState } from "../utils";
const assert = require("assert");

describe("utils", () => {
  describe("bindSelectorsToState", () => {
    describe("[EXPECTS]", () => {
      describe("[0] subStateGetter", () => {
        it("[ACCEPTS] a non-empty string", () => {
          assert.doesNotThrow(function() {
            bindSelectorsToState("non empty", {});
          });
        });
        it("[ACCEPTS] a function", () => {
          assert.doesNotThrow(function() {
            bindSelectorsToState(function() {}, {});
          });
        });
        describe("[THROWS] throws a ModuleInitializationTypeError if it is not a non-empty string", () => {
          [undefined, "", {}, [], null, false].forEach(value => {
            it(`[THROWS] if 'subStateGetter' is a ${typeof value}: ${value}`, () => {
              try {
                bindSelectorsToState(value, {});
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          });
        });
      });
      describe("[1] selectors", () => {});
    });
    describe("[RETURNS]", () => {});
  });
});
