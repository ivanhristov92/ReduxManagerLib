var assert = require("assert");
import actionTypesFactory from "../crud-action-types";
import * as _ from "ramda";

describe("CRUD Action Types", () => {
  describe("The module must expose a factory function, that creates the action types for a model", function() {
    it("The module should default export a function", () => {
      assert.equal(typeof actionTypesFactory, "function");
    });
  });

  describe("The factory function must return an object with the action types", function() {
    it("returns an object", () => {
      let actionTypes = actionTypesFactory();
      assert.equal(typeof actionTypes, "object");
    });
    it("returns a non-empty object", () => {
      let actionTypes = actionTypesFactory();
      assert.equal(_.isEmpty(actionTypes), false);
    });

    describe("The factory function must return an object with all CREATE action types", function() {
      it("returns an object with a CREATE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("CREATE", actionTypes), true);
      });
      it("returns an object with a CREATE__SUCCESS action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("CREATE__SUCCESS", actionTypes), true);
      });
      it("returns an object with a CREATE__FAILURE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("CREATE__FAILURE", actionTypes), true);
      });
    });

    describe("The factory function must return an object with all READ action types", function() {
      it("returns an object with a READ action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("READ", actionTypes), true);
      });
      it("returns an object with a READ__SUCCESS action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("READ__SUCCESS", actionTypes), true);
      });
      it("returns an object with a READ__FAILURE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("READ__FAILURE", actionTypes), true);
      });
    });

    describe("The factory function must return an object with all UPDATE action types", function() {
      it("returns an object with a UPDATE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("UPDATE", actionTypes), true);
      });
      it("returns an object with a UPDATE__SUCCESS action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("UPDATE__SUCCESS", actionTypes), true);
      });
      it("returns an object with a UPDATE__FAILURE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("UPDATE__FAILURE", actionTypes), true);
      });
    });

    describe("The factory function must return an object with all DELETE action types", function() {
      it("returns an object with a DELETE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("DELETE", actionTypes), true);
      });
      it("returns an object with a DELETE__SUCCESS action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("DELETE__SUCCESS", actionTypes), true);
      });
      it("returns an object with a DELETE__FAILURE action type", () => {
        let actionTypes = actionTypesFactory();
        assert.equal(_.has("DELETE__FAILURE", actionTypes), true);
      });
    });
  });

  describe("The action types must adhere to the standard", function() {
    describe("all action types begin with the name of the module", function() {
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
        it(actionType + " begins with the name of the module and a '/'", () => {
          const MODEL_NAME = "MyModel";
          let actionTypes = actionTypesFactory(MODEL_NAME);
          let match = actionTypes[actionType].match(
            new RegExp("^" + MODEL_NAME + "/")
          );
          assert.notEqual(match, null);
        });
      });
    });
  });

  describe("The object returned by the factory function must have an extend method used during model instantiation", function() {});

  describe("The object returned by the factory function must have an extendFactory method used for creating unique system defaults for this layer", function() {});
});
