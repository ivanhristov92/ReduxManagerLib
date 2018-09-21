import restApiFactory from "../crud-rest-api";
var assert = require("assert");
var sinon = require("sinon");
import * as _ from "ramda";

import reducerFactory from "../crud-reducer";

describe("CRUD Rest Api", () => {
  describe("The module must expose a factory function, that creates the reducer for a model", function() {
    it("The module should default export a function", () => {
      assert.equal(typeof reducerFactory, "function");
    });
    it("The factory function must return a function", () => {
      assert.equal(typeof reducerFactory(), "function");
    });
  });

  describe("The reducer must handle actions correctly", function() {
    it("The reducer should expect a valid action", () => {
      const emptyActionTypes = {};
      const reducer = reducerFactory();
      const nonExistantAction = {};
      assert.throws(function() {
        let state = reducer(undefined, nonExistantAction);
      }, Error);
    });

    it("The reducer should return a default state initially", () => {
      const emptyActionTypes = {};
      const reducer = reducerFactory(emptyActionTypes);
      const nonExistantAction = { type: "TEST" };
      let state = reducer(undefined, nonExistantAction);
      assert.equal(typeof state, "object");
      assert.deepEqual(state, { byId: {}, isFetching: false });
    });

    it("The reducer should return state as is, if the action is unknown", () => {
      const emptyActionTypes = {};
      const reducer = reducerFactory(emptyActionTypes);
      const nonExistantAction = { type: "UNKNOWN" };
      const testState = { byId: { test: true } };
      let state = reducer(testState, nonExistantAction);
      assert.deepEqual(state, testState);
    });

    ["CREATE", "READ", "UPDATE", "DELETE"].forEach(crudAct => {
      it("The reducer should return state as is, if the action is unknown", () => {
        // const emptyActionTypes = {};
        // const reducer = reducerFactory(emptyActionTypes);
        // const nonExistantAction = { type: "UNKNOWN" };
        // const testState = { byId: { test: true } };
        // let state = reducer(testState, nonExistantAction);
        // assert.deepEqual(state, testState);
      });
    });
  });
});
