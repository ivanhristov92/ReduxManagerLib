import actionCreatorsFactory from "../crud-action-creators";

var assert = require("assert");
var sinon = require("sinon");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import reducerFactory from "../crud-reducer";

import createMocks from "./create-mocks";

describe("CRUD Rest Api", () => {
  describe("[EXPORTS]", function() {
    it("The module must expose a factory function", () => {
      assert.equal(typeof reducerFactory, "function");
    });
  });

  describe("[MODULE INITIALIZATION SIGNATURE]", () => {
    describe("reducerFactory", () => {
      describe("[EXPECTS] 'actionTypes: ActionTypes' as 0th argument", () => {
        it("[ACCEPTS] an object of type ActionTypes", () => {
          const { mockActionTypes } = createMocks();
          assert.doesNotThrow(function() {
            reducerFactory(mockActionTypes);
          }, Error);
        });

        [1, undefined, " ", true, null, [], Error, function() {}, {}].forEach(
          data => {
            it(
              "[THROWS] throws if it is provided a " +
                typeof data +
                ": " +
                data,
              () => {
                assert.throws(function() {
                  reducerFactory(data);
                });
              }
            );
          }
        );
      });

      describe("[RETURNS]", () => {
        it("[RETURNS] The factory function must return a function", () => {
          const { mockActionTypes } = createMocks();
          assert.equal(typeof reducerFactory(mockActionTypes), "function");
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", () => {
    describe("reducerFactory", () => {
      describe("[HANDLES] does not allow 'actionTypes' to be changed from outside", () => {
        it("the incorrect action type does not affect the state", () => {
          const { mockActionTypes } = createMocks();
          const reducer = reducerFactory(mockActionTypes);
          const initialState = reducer(undefined);
          const createAction = { type: mockActionTypes.CREATE, payload: {} };
          mockActionTypes["CREATE"] = `NOT_CREATE`;
          const stateAfterAction = reducer(initialState, createAction);
          assert.deepEqual(initialState, stateAfterAction);
        });

        it("the correct action type affects the state", () => {
          const { mockActionTypes } = createMocks();
          const reducer = reducerFactory(mockActionTypes);
          const initialState = reducer(undefined);
          const createAction = { type: mockActionTypes.CREATE, payload: {} };
          mockActionTypes["CREATE"] = `NOT_CREATE`;

          const stateAfterAction = reducer(initialState, createAction);
          assert.notDeepEqual(initialState, stateAfterAction);
        });
      });
    });
  });

  describe("[OPERATION]", () => {});

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
      it(`The reducer should turn ON the isFetching flag on "${crudAct}"`, () => {
        const actionTypes = { [crudAct]: crudAct };
        const reducer = reducerFactory(actionTypes);
        const action = { type: crudAct };
        let state = reducer(undefined, action);
        assert.equal(state.isFetching, true);
      });
    });

    ["CREATE", "READ", "UPDATE", "DELETE"].forEach(_crudAct => {
      let crudAct = _crudAct + "__FAILURE";
      it(`The reducer should turn OFF the isFetching flag on "${crudAct}"`, () => {
        const actionTypes = { [crudAct]: crudAct };
        const reducer = reducerFactory(actionTypes);
        const action = { type: crudAct };
        let state = reducer({ byId: {}, isFetching: true }, action);
        assert.equal(state.isFetching, false);
      });
    });

    ["CREATE", "READ", "UPDATE"].forEach(_crudAct => {
      let crudAct = _crudAct + "__SUCCESS";
      it(`The reducer should turn OFF the isFetching flag on "${crudAct}"`, () => {
        const actionTypes = { [crudAct]: crudAct };
        const reducer = reducerFactory(actionTypes);
        const action = { type: crudAct, payload: { byId: {} } };
        let state = reducer({ byId: {}, isFetching: true }, action);
        assert.equal(state.isFetching, false);
      });
    });

    it(`The reducer should turn OFF the isFetching flag on "DELETE__SUCCESS"`, () => {
      let crudAct = "DELETE__SUCCESS";
      const actionTypes = { [crudAct]: crudAct };
      const reducer = reducerFactory(actionTypes);
      const action = { type: crudAct, payload: { id: 10 } };
      let state = reducer({ byId: {}, isFetching: true }, action);
      assert.equal(state.isFetching, false);
    });

    ["CREATE", "READ", "UPDATE"].forEach(_crudAct => {
      let crudAct = _crudAct + "__SUCCESS";
      it(`The reducer should update the state 'byId' section on "${crudAct}"`, () => {
        const actionTypes = { [crudAct]: crudAct };
        const reducer = reducerFactory(actionTypes);
        const action = { type: crudAct, payload: { byId: { c: 3 } } };
        let state = reducer({ byId: { a: 1, b: 2 }, isFetching: true }, action);
        assert.deepEqual(state.byId, { a: 1, b: 2, c: 3 });
      });
    });
    it(`The reducer should update the state 'byId' section on "DELETE__SUCCESS"`, () => {
      let crudAct = "DELETE__SUCCESS";
      const actionTypes = { [crudAct]: crudAct };
      const reducer = reducerFactory(actionTypes);
      const action = { type: crudAct, payload: { id: "b" } };
      let state = reducer({ byId: { a: 1, b: 2 }, isFetching: true }, action);
      assert.deepEqual(state.byId, { a: 1 });
    });
  });
});
