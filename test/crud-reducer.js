import actionCreatorsFactory from "../crud-action-creators";

var assert = require("assert");
var sinon = require("sinon");

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

      describe("[EXPECTS] a 'customErrorHandler' function as the 1st argument", () => {
        it("[ACCEPTS] undefined", () => {
          const { mockActionTypes } = createMocks();
          assert.doesNotThrow(function() {
            reducerFactory(mockActionTypes, undefined);
          }, Error);
        });

        it("[ACCEPTS] a function", () => {
          const { mockActionTypes } = createMocks();
          assert.doesNotThrow(function() {
            reducerFactory(mockActionTypes, function() {});
          }, Error);
        });

        [1, " ", true, null, [], {}].forEach(data => {
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
      });

      describe("[RETURNS]", () => {
        it("[CORRECT TYPE] The factory function must return a function", () => {
          const { mockActionTypes } = createMocks();
          assert.equal(typeof reducerFactory(mockActionTypes), "function");
        });

        it("[CORRECT TYPE] The returned function must have an 'extend' method", () => {
          const { mockActionTypes } = createMocks();
          assert.equal(
            typeof reducerFactory(mockActionTypes).extend,
            "function"
          );
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
              let errorHandler = {
                errorHandler() {}
              };
              sinon.spy(errorHandler, "errorHandler");
              const reducer = reducerFactory(
                mockActionTypes,
                errorHandler.errorHandler
              );

              reducer(data, { type: "test" });
              const errorHandlerCall = errorHandler.errorHandler.getCall(0);
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
              let errorHandler = {
                errorHandler() {}
              };
              sinon.spy(errorHandler, "errorHandler");
              const reducer = reducerFactory(
                mockActionTypes,
                errorHandler.errorHandler
              );

              reducer(undefined, data);
              const errorHandlerCall = errorHandler.errorHandler.getCall(0);
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

            it("The initial state should look like: '{byId: {}, isFetching: false, error: null}'", () => {
              let state = reducer(undefined, unknownAction);
              assert.deepEqual(state, {
                byId: {},
                isFetching: false,
                error: null
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
                it(`The reducer should turn ON the isFetching flag on "${crudAct}"`, () => {
                  const action = { type: crudAct };
                  let state = reducer(undefined, action);
                  assert.equal(state.isFetching, true);
                });

                it(`The reducer should turn OFF the isFetching flag on "${crudAct}__FAILURE"`, () => {
                  const action = { type: `${crudAct}__FAILURE`, error: {} };
                  let state = reducer({ byId: {}, isFetching: true }, action);
                  assert.equal(state.isFetching, false);
                });

                it(`The reducer should turn OFF the isFetching flag on "${crudAct}__SUCCESS"`, () => {
                  const action = { type: `${crudAct}__SUCCESS`, payload: {} };
                  let state = reducer({ byId: {}, isFetching: true }, action);
                  assert.equal(state.isFetching, false);
                });

                if (crudAct === "DELETE") {
                  it(`The reducer should update the state 'byId' section on "DELETE__SUCCESS"`, () => {
                    let crudAct = "DELETE__SUCCESS";
                    const action = { type: crudAct, payload: { id: "b" } };
                    let state = reducer(
                      { byId: { a: 1, b: 2 }, isFetching: true },
                      action
                    );
                    assert.deepEqual(state.byId, { a: 1 });
                  });
                } else {
                  it(`The reducer should update the state 'byId' section on "${crudAct}__SUCCESS"`, () => {
                    const action = {
                      type: `${crudAct}__SUCCESS`,
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

  // describe("[OPERATION]", () => {
  //   describe("[HANDLES] does not allow 'actionTypes' to be changed from outside", () => {
  //     it("the incorrect action type does not affect the state", () => {
  //       const { mockActionTypes } = createMocks();
  //       const reducer = reducerFactory(
  //         mockActionTypes,
  //         function emptyErrorHandler() {}
  //       );
  //       const initialState = reducer(undefined);
  //       const createAction = { type: mockActionTypes.CREATE, payload: {} };
  //       mockActionTypes["CREATE"] = `NOT_CREATE`;
  //       const stateAfterAction = reducer(initialState, createAction);
  //       assert.deepEqual(initialState, stateAfterAction);
  //     });
  //
  //     it("the correct action type affects the state", () => {
  //       const { mockActionTypes } = createMocks();
  //       const reducer = reducerFactory(
  //         mockActionTypes,
  //         function emptyErrorHandler() {}
  //       );
  //       const initialState = reducer(undefined);
  //       const createAction = { type: mockActionTypes.CREATE, payload: {} };
  //       const stateAfterAction = reducer(initialState, createAction);
  //       assert.notDeepEqual(initialState, stateAfterAction);
  //     });
  //   });
  // });
});
