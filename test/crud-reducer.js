import actionCreatorsFactory from "../crud-action-creators";

var assert = require("assert");
var sinon = require("sinon");

import * as _ from "ramda";

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
              "[THROWS] throws a 'ModuleInitializationTypeError' if it is provided a " +
                typeof data +
                ": " +
                data,
              () => {
                try {
                  reducerFactory(data);
                  throw new Error("Should have thrown");
                } catch (err) {
                  assert.equal(err.name, "ModuleInitializationTypeError");
                }
              }
            );
          }
        );
      });

      describe("[EXPECTS] an 'options' object as the 1st argument", () => {
        it("[ACCEPTS] undefined", () => {
          const { mockActionTypes } = createMocks();
          assert.doesNotThrow(function() {
            reducerFactory(mockActionTypes, undefined);
          }, Error);
        });

        it("[ACCEPTS] an object", () => {
          const { mockActionTypes } = createMocks();
          assert.doesNotThrow(function() {
            reducerFactory(mockActionTypes, {});
          }, Error);
        });

        [1, " ", true, null, [], function() {}].forEach(data => {
          it(
            "[THROWS] throws a 'ModuleInitializationTypeError' if it is provided a " +
              typeof data +
              ": " +
              data,
            () => {
              const { mockActionTypes } = createMocks();
              try {
                reducerFactory(mockActionTypes, data);
                throw new Error("Should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            }
          );
        });

        describe("options.customErrorHandler", () => {
          [1, " ", true, null, [], {}].forEach(data => {
            it(
              "[THROWS] throws a 'ModuleInitializationTypeError' if options.customErrorHandler is not a function or undefined " +
                typeof data +
                ": " +
                data,
              () => {
                const { mockActionTypes } = createMocks();
                try {
                  reducerFactory(mockActionTypes, { customErrorHandler: data });
                  throw new Error("Should have thrown");
                } catch (err) {
                  assert.equal(err.name, "ModuleInitializationTypeError");
                }
              }
            );
          });
        });
        describe("options.additional", () => {
          [1, " ", true, null, [], function() {}].forEach(data => {
            it(
              "[THROWS] throws a 'ModuleInitializationTypeError' if options.additional is not an object or undefined " +
                typeof data +
                ": " +
                data,
              () => {
                const { mockActionTypes } = createMocks();
                try {
                  reducerFactory(mockActionTypes, { additional: data });
                  throw new Error("Should have thrown");
                } catch (err) {
                  assert.equal(err.name, "ModuleInitializationTypeError");
                }
              }
            );
          });
        });
      });

      describe("[RETURNS]", () => {
        it("[CORRECT TYPE] The factory function must return a function", () => {
          const { mockActionTypes } = createMocks();
          assert.equal(typeof reducerFactory(mockActionTypes), "function");
        });
        it("[CORRECT VALUE] The factory function must return a function, that has the added extensions", () => {
          const { mockActionTypes } = createMocks();
          const reducer = reducerFactory(mockActionTypes, {
            additional: {
              TEST_ME(state, action) {
                return {
                  ...state,
                  tested: true
                };
              }
            }
          });
          let changedState = reducer(
            { byId: {}, isFetching: false, tested: false },
            { type: "TEST_ME" }
          );
          assert.equal(changedState.tested, true);
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", () => {
    describe("reducer", () => {
      describe("[EXPECTS]", () => {
        describe("'state' as 0th argument", () => {
          it("[ACCEPTS] undefined", () => {
            const { mockActionTypes } = createMocks();
            const reducer = reducerFactory(mockActionTypes);
            assert.doesNotThrow(function() {
              reducer(undefined, { type: "test" });
            }, Error);
          });
          it("[ACCEPTS] an object", () => {
            const { mockActionTypes } = createMocks();
            const reducer = reducerFactory(mockActionTypes);
            assert.doesNotThrow(function() {
              reducer({}, { type: "test" });
            }, Error);
          });

          [
            null,
            2,
            false,
            true,
            Error,
            function() {},
            [],
            "",
            "string"
          ].forEach(data => {
            it(`[THROWS][HANDLES] should call an error handler internally if 'state' is of type ${typeof data}: ${data}`, () => {
              const { mockActionTypes } = createMocks();
              let options = {
                customErrorHandler() {}
              };
              sinon.spy(options, "customErrorHandler");
              const reducer = reducerFactory(mockActionTypes, options);

              reducer(data, { type: "test" });
              const errorHandlerCall = options.customErrorHandler.getCall(0);
              assert.notEqual(errorHandlerCall, null);
            });
          });
        });

        describe("'action'", () => {
          it("[ACCEPTS] an object with 'type'", () => {
            const { mockActionTypes } = createMocks();
            const reducer = reducerFactory(mockActionTypes);
            assert.doesNotThrow(function() {
              reducer(undefined, { type: "test" });
            }, Error);
          });

          [
            null,
            2,
            false,
            true,
            Error,
            function() {},
            [],
            "",
            "string",
            {}
          ].forEach(data => {
            it(`[THROWS][HANDLES] should call an error handler internally if 'action' is of type ${typeof data}: ${JSON.stringify(
              data
            )}`, () => {
              const { mockActionTypes } = createMocks();
              let options = {
                customErrorHandler() {}
              };
              sinon.spy(options, "customErrorHandler");
              const reducer = reducerFactory(mockActionTypes, options);

              reducer(undefined, data);
              const errorHandlerCall = options.customErrorHandler.getCall(0);
              assert.notEqual(errorHandlerCall, null);
            });
          });

          it("[THROWS][HANDLES] error actions must have an 'error' attribute", () => {});
          it("[THROWS][HANDLES] success actions must have an 'payload' attribute", () => {});
        });
      });

      describe("[RETURNS]", () => {
        it("[CORRECT TYPE] returns an object", () => {
          const { mockActionTypes } = createMocks();
          let reducer = reducerFactory(mockActionTypes);
          let state = reducer(undefined, { type: "test" });
          assert.equal(typeof state, "object");
        });

        describe("[CORRECT VALUE]", () => {
          let mockActionTypes;
          let unknownAction;
          let reducer;
          beforeEach(() => {
            mockActionTypes = createMocks().mockActionTypes;
            unknownAction = { type: "TEST" };
            reducer = reducerFactory(mockActionTypes);
          });

          describe("default state", () => {
            it("The reducer should return a default state initially", () => {
              let state = reducer(undefined, unknownAction);
              assert.equal(typeof state, "object");
            });

            it("The initial state should look like: '{byId: {}, error: null, create: 'IDLE', read: 'IDLE, update: 'IDLE', delete: 'IDLE'}'", () => {
              let state = reducer(undefined, unknownAction);
              assert.deepEqual(state, {
                byId: {},
                error: null,
                create: "IDLE",
                read: "IDLE",
                update: "IDLE",
                delete: "IDLE"
              });
            });
          });

          describe("action types", () => {
            describe("unknown action type", () => {
              it("The reducer should return state as is, if the action is unknown", () => {
                const testState = { byId: { test: true } };
                let state = reducer(testState, unknownAction);
                assert.deepEqual(state, testState);
              });
            });

            ["CREATE", "READ", "UPDATE", "DELETE"].forEach(crudAct => {
              describe(crudAct, () => {
                it(`The reducer should turn ON 'LOADING' flag on "${crudAct}"`, () => {
                  const action = { type: mockActionTypes[crudAct] };
                  let state = reducer(undefined, action);
                  assert.equal(state[crudAct.toLowerCase()], "LOADING");
                });

                it(`The reducer should turn ON the "FAILURE" flag on "${crudAct}__FAILURE"`, () => {
                  const action = {
                    type: mockActionTypes[`${crudAct}__FAILURE`],
                    error: {}
                  };
                  let state = reducer(
                    { byId: {}, [crudAct.toLowerCase()]: "LOADING" },
                    action
                  );
                  assert.equal(state[crudAct.toLowerCase()], "FAILURE");
                });

                it(`The reducer should turn ON the "SUCCESS" flag on "${crudAct}__SUCCESS"`, () => {
                  const action = {
                    type: mockActionTypes[`${crudAct}__SUCCESS`],
                    payload: {}
                  };
                  let state = reducer(
                    { byId: {}, [crudAct.toLowerCase()]: "LOADING" },
                    action
                  );
                  assert.equal(state[crudAct.toLowerCase()], "SUCCESS");
                });

                if (crudAct === "DELETE") {
                  it(`The reducer should update the state 'byId' section on "DELETE__SUCCESS"`, () => {
                    let crudAct = "DELETE__SUCCESS";
                    const action = {
                      type: mockActionTypes[crudAct],
                      payload: { id: "b" }
                    };
                    let state = reducer(
                      { byId: { a: 1, b: 2 }, isFetching: true },
                      action
                    );
                    assert.deepEqual(state.byId, { a: 1 });
                  });
                } else {
                  it(`The reducer should update the state 'byId' section on "${crudAct}__SUCCESS"`, () => {
                    const action = {
                      type: mockActionTypes[`${crudAct}__SUCCESS`],
                      payload: { byId: { c: 3 } }
                    };
                    let state = reducer(
                      { byId: { a: 1, b: 2 }, isFetching: true },
                      action
                    );
                    assert.deepEqual(state.byId, { a: 1, b: 2, c: 3 });
                  });
                }
              });
            });
          });
        });
      });
    });
  });

  describe("[OPERATION]", () => {
    describe("reducer", () => {
      describe("[HANDLES] does not allow 'actionTypes' to be changed from outside", () => {
        it("the incorrect action type does not affect the state", () => {
          const { mockActionTypes } = createMocks();

          const reducer = reducerFactory(mockActionTypes);
          const initialState = reducer(undefined, { type: "test" });
          const createAction = { type: mockActionTypes.CREATE, payload: {} };
          mockActionTypes["CREATE"] = `NOT_CREATE`;
          const stateAfterAction = reducer(initialState, createAction);
          assert.notDeepEqual(initialState, stateAfterAction);
        });

        it("the correct action type affects the state", () => {
          const { mockActionTypes } = createMocks();
          const reducer = reducerFactory(mockActionTypes);
          const initialState = reducer(undefined, { type: "test" });
          const createAction = { type: mockActionTypes.CREATE, payload: {} };
          const stateAfterAction = reducer(initialState, createAction);
          assert.notDeepEqual(initialState, stateAfterAction);
        });
      });

      describe("[CALLS] customErrorHandler", () => {
        describe("calls the 'customErrorHandlerFunction' with the proper arguments", () => {
          let mockActionTypes;
          let options;
          let reducer;
          beforeEach(() => {
            mockActionTypes = createMocks().mockActionTypes;
            options = { customErrorHandler() {} };
            sinon.spy(options, "customErrorHandler");
            reducer = reducerFactory(mockActionTypes, options);
          });

          it("passes 2 arguments", () => {
            reducer(undefined, null);
            const errorHandlerCall = options.customErrorHandler.getCall(0);
            const args = errorHandlerCall.args;
            assert.equal(args.length, 2);
          });

          it("1st argument is the error", () => {
            reducer(undefined, null);
            const errorHandlerCall = options.customErrorHandler.getCall(0);
            const firstArg = errorHandlerCall.args[0];
            assert.equal(firstArg instanceof Error, true);
          });

          it("2nd argument is the details object", () => {
            let state = { testState: true };
            reducer(state, null);
            const errorHandlerCall = options.customErrorHandler.getCall(0);
            const secondArg = errorHandlerCall.args[1];
            assert.equal(typeof secondArg, "object");
            assert.notEqual(Array.isArray(secondArg), true);
          });
        });
      });
    });
  });
});
