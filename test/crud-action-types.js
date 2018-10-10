import actionCreatorsFactory from "../crud-action-creators";

var assert = require("assert");
import actionTypesFactory from "../crud-action-types";
import * as _ from "ramda";

describe("CRUD Action Types", () => {
  describe("[EXPORTS] The module must expose a factory function", function() {
    it("The module should default export a function", () => {
      assert.equal(typeof actionTypesFactory, "function");
    });
  });

  describe("[MODULE INITIALIZATION SIGNATURE]", () => {
    describe("actionTypesFactory", () => {
      describe("[EXPECTS] 'modelName' to be a string, 0th argument", () => {
        it("[ACCEPTS] a string for 'modelName'", () => {
          assert.doesNotThrow(function() {
            actionTypesFactory("Some String");
          }, Error);
        });

        [null, undefined, 2, true, function() {}, {}, ""].forEach(data => {
          it(`[THROWS] if 'modelName' is not a string. Throws for ${typeof data}: ${data}`, () => {
            assert.throws(function() {
              actionTypesFactory(data);
            }, Error);
          });
        });

        it("[THROWS] throws a ModuleInitializationTypeError if 'modelName' is not provided", () => {
          try {
            actionTypesFactory(null);
          } catch (err) {
            assert.equal(err.name, "ModuleInitializationTypeError");
          }
        });
      });

      describe("[RETURNS]", function() {
        describe("[CORRECT TYPE] The object returned by the factory function must have an 'extend' method", () => {
          it("The returned object has an extend method", () => {
            let actionTypes = actionTypesFactory("SomeModel");
            assert.equal(typeof actionTypes.extend, "function");
          });
        });

        describe("[CORRECT TYPE] The factory function must return an object with the action types", () => {
          let actionTypes = actionTypesFactory("SomeModel");

          it("returns an object", () => {
            assert.equal(typeof actionTypes, "object");
          });
          it("returns a non-empty object", () => {
            assert.equal(_.isEmpty(actionTypes), false);
          });

          [
            "CREATE",
            "CREATE__SUCCESS",
            "CREATE__FAILURE",
            "READ",
            "READ__SUCCESS",
            "READ__FAILURE",
            "UPDATE",
            "UPDATE__SUCCESS",
            "UPDATE__FAILURE",
            "DELETE",
            "DELETE__SUCCESS",
            "DELETE__FAILURE"
          ].forEach(actionType => {
            it(`returns an object with a ${actionType} action type`, () => {
              assert.equal(_.has(actionType, actionTypes), true);
            });
          });
        });

        describe("[CORRECT VALUE] all action types begin with the name of the module", function() {
          [
            "CREATE",
            "CREATE__SUCCESS",
            "CREATE__FAILURE",
            "READ",
            "READ__SUCCESS",
            "READ__FAILURE",
            "UPDATE",
            "UPDATE__SUCCESS",
            "UPDATE__FAILURE",
            "DELETE",
            "DELETE__SUCCESS",
            "DELETE__FAILURE"
          ].map(actionType => {
            it(
              actionType + " begins with the name of the module and a '/'",
              () => {
                const MODEL_NAME = "MyModel";
                let actionTypes = actionTypesFactory(MODEL_NAME);
                let match = actionTypes[actionType].match(
                  new RegExp("^" + MODEL_NAME + "/")
                );
                assert.notEqual(match, null);
              }
            );
          });
        });
      });
    });

    describe("'extend'", () => {
      describe("[EXPECTS] an object", () => {
        it("[ACCEPTS] an object", () => {
          assert.doesNotThrow(function() {
            let actionTypes = actionTypesFactory("SomeModel");
            actionTypes.extend({});
          }, Error);
        });

        [null, undefined, 0, 1, true, false, function() {}, []].forEach(
          data => {
            it(`[THROWS ]The 'extend' method THROWS for ${typeof data}: ${data}`, () => {
              let actionTypes = actionTypesFactory("SomeModel");

              assert.throws(function() {
                actionTypes.extend(data);
              }, Error);
            });
          }
        );
      });

      describe("[RETURNS]", () => {
        it("[CORRECT TYPE] The 'extend' method returns an object", () => {
          let actionTypes = actionTypesFactory("SomeModel");
          let extendedActionTypes = actionTypes.extend({
            TEST_TYPE: "TEST_TYPE"
          });
          assert.equal(typeof extendedActionTypes, "object");
        });

        it("[CORRECT TYPE] The 'extend' method adds new action types to the object", () => {
          let actionTypes = actionTypesFactory("SomeModel");
          let extendedActionTypes = actionTypes.extend({
            TEST_TYPE: "TEST_TYPE"
          });
          assert.equal(_.has("TEST_TYPE", extendedActionTypes), true);
        });
      });

      describe("[OPERATION]", () => {
        it("The 'extend' method does not modify the original object", () => {
          let actionTypes = actionTypesFactory("SomeModel");
          let actionTypesBackup = actionTypesFactory("SomeModel");
          actionTypes.extend({ TEST_TYPE: "TEST_TYPE" });
          assert.deepEqual(actionTypes, actionTypesBackup);
        });
      });
    });
  });
});
