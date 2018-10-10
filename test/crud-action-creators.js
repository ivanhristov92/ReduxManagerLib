// c. Action Creators – ModelName.(verb + State) : MyModel.(create | createSuccess)()
//     = verbs – create, read, update, delete
//     = states – Success, Failure
// d. State name – model name
// e. Selectors – all selectors begin with “get”
// = verbs – get (optional getOne), getIds, getCount

import actionCreatorsFactory from "../crud-action-creators";
var assert = require("assert");
var sinon = require("sinon");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

import * as _ from "ramda";
import { ModuleInitializationTypeError } from "../crud-error-types";

function createMocks(restApiRejects = false) {
  return {
    mockActionTypes: {
      CREATE: "CREATE",
      CREATE__SUCCESS: "CREATE__SUCCESS",
      CREATE__FAILURE: "CREATE__FAILURE",
      READ: "READ",
      READ__SUCCESS: "READ__SUCCESS",
      READ__FAILURE: "READ__FAILURE",
      UPDATE: "UPDATE",
      UPDATE__SUCCESS: "UPDATE__SUCCESS",
      UPDATE__FAILURE: "UPDATE__FAILURE",
      DELETE: "DELETE",
      DELETE__SUCCESS: "DELETE__SUCCESS",
      DELETE__FAILURE: "DELETE__FAILURE"
    },
    mockRestApi: {
      create() {
        return testPromise();
      },
      read() {
        return testPromise();
      },
      update() {
        return testPromise();
      },
      delete() {
        return testPromise();
      }
    }
  };

  function testPromise() {
    return new Promise((resolve, reject) => {
      restApiRejects ? reject({ test: false }) : resolve({ test: true });
    });
  }
}

describe("CRUD Action Creators", () => {
  describe("[EXPORTS] The module must expose a factory function, that creates the action creators for a model", function() {
    it("The module should default export a function", () => {
      assert.equal(typeof actionCreatorsFactory, "function");
    });
  });

  describe("[MODULE INITIALIZATION SIGNATURE]", function() {
    const { mockActionTypes, mockRestApi } = createMocks();

    describe("actionCreatorsFactory", () => {
      describe("[EXPECTS] 'actionTypes' must be required", () => {
        it("[THROWS] if 'actionTypes' is not provided", () => {
          assert.throws(function() {
            actionCreatorsFactory(null, {});
          }, Error);
        });

        it("[THROWS] throws a ModuleInitializationTypeError if 'actionTypes' is not provided", () => {
          try {
            actionCreatorsFactory(null, {});
          } catch (err) {
            assert.equal(err.name, "ModuleInitializationTypeError");
          }
        });

        it("[ACCEPTS][CORRECT TYPE] accepts an ActionTypes object for 'actionTypes'", () => {
          assert.doesNotThrow(function() {
            actionCreatorsFactory(mockActionTypes, mockRestApi);
          });
        });
      });

      describe("[EXPECTS] 'restApi' must be required", () => {
        it("[THROWS] if 'restApi' is not provided", () => {
          assert.throws(function() {
            actionCreatorsFactory({}, null, {});
          }, Error);
        });

        it("[THROWS] throws a ModuleInitializationTypeError if 'restApi' is not provided", () => {
          try {
            actionCreatorsFactory({}, null, {});
            throw new Error("should have thrown");
          } catch (err) {
            assert.equal(err.name, "ModuleInitializationTypeError");
          }
        });

        it("[ACCEPTS][CORRECT TYPE] accepts an ActionTypes object for 'actionTypes'", () => {
          assert.doesNotThrow(function() {
            actionCreatorsFactory(mockActionTypes, mockRestApi);
          });
        });
      });

      describe("[RETURNS] the factory function returns:", () => {
        describe("[CORRECT TYPE] The factory function must return an object with the action creators", () => {
          let actionCreators;
          beforeEach(function() {
            actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );
          });

          it("returns an object", () => {
            assert.equal(typeof actionCreators, "object");
          });

          it("returns a non-empty object", () => {
            assert.equal(_.isEmpty(actionCreators), false);
          });

          ["create", "read", "update", "delete"].forEach(crudAct => {
            const propNotFound = " property was not found";
            it(`returns an object with a '${crudAct}' function`, () => {
              assert.equal(
                _.has(crudAct, actionCreators),
                true,
                `${crudAct} ${propNotFound}`
              );
              assert.equal(typeof actionCreators[crudAct], "function");
            });
          });
        });

        describe("[CORRECT TYPE] - Contains an extend method", () => {
          it("The returned object has an extend method", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );

            assert.equal(typeof actionCreators.extend, "function");
          });
        });
      });
    });

    describe("'extend' method", function() {
      let actionCreators;
      beforeEach(function() {
        actionCreators = actionCreatorsFactory(mockActionTypes, mockRestApi);
      });

      describe("[EXPECTS] 'extend' only accepts objects", () => {
        [1, undefined, " ", true, null, []].forEach(value => {
          it(
            "[THROWS] throws if it is provided a " +
              typeof value +
              ": " +
              value,
            () => {
              assert.throws(function() {
                actionCreators.extend(value);
              });
            }
          );
        });
      });

      describe("[RETURNS]", () => {
        describe("[CORRECT TYPE] The 'extend' method must return a new object with the added action creators", () => {
          it("The 'extend' method returns an object", () => {
            let extendedActionCreators = actionCreators.extend({});
            assert.equal(typeof extendedActionCreators, "object");
          });

          it("The 'extend' method adds new action creators to the object", () => {
            let extendedActionCreators = actionCreators.extend({
              testAction() {}
            });
            assert.equal(_.has("testAction", extendedActionCreators), true);
          });

          it("The 'extend' method does not modify the original object", () => {
            let actionCreatorsBackup = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );

            actionCreators.extend({ testAction() {} });
            assert.deepEqual(
              _.keys(actionCreators),
              _.keys(actionCreatorsBackup)
            );
          });
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", function() {
    function dispatch() {}
    let actionCreators;
    let mockRestApi, mockActionTypes;

    ["create", "read", "update", "delete"].forEach(crudAct => {
      describe(`${crudAct}' method`, () => {
        beforeEach(function() {
          const mocks = createMocks();
          mockRestApi = mocks.mockRestApi;
          mockActionTypes = mocks.mockActionTypes;
          actionCreators = actionCreatorsFactory(mockActionTypes, mockRestApi);
        });

        describe("[ACCEPTS] any type of data", () => {
          [1, " aa", {}, [], null, undefined, true, false, Infinity].forEach(
            value => {
              it(`does not throw when provided a ${typeof value} type: ${value}`, () => {
                assert.doesNotThrow(() => {
                  actionCreators[crudAct](value)(dispatch);
                });
              });
            }
          );
        });
        describe("[HANDLES]", () => {
          beforeEach(function() {
            const mocks = createMocks();
            mockRestApi = mocks.mockRestApi;
            mockActionTypes = mocks.mockActionTypes;
            actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );
            const window = new JSDOM(`<!DOCTYPE html>`).window;
            global.document = window.document;
            global.window = window;
          });

          it("does not allow the 'actionTypes' argument object to be modified from outside", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );
            mockActionTypes[
              crudAct.toUpperCase()
            ] = `NOT_${crudAct.toUpperCase()}`;
            let store = { dispatch() {} };
            sinon.spy(store, "dispatch");
            const thunkFunction = actionCreators[crudAct]();
            thunkFunction(store.dispatch);
            const dispatchCall = store.dispatch.getCall(0);
            assert.notEqual(
              dispatchCall.args[0].type,
              mockActionTypes[crudAct.toUpperCase()]
            );
          });

          it("does not allow the 'restApi' argument object to be modified from outside", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );

            const fakeMockRestApi = {
              fakeCrudAct() {}
            };
            let store = { dispatch() {} };
            sinon.spy(fakeMockRestApi, "fakeCrudAct");
            mockRestApi[crudAct] = fakeMockRestApi.fakeCrudAct;
            const thunkFunction = actionCreators[crudAct]();
            thunkFunction(store.dispatch);
            assert.equal(fakeMockRestApi.fakeCrudAct.getCall(0), null);
          });

          it("does not throw if not provided with a 'dispatch' function", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );
            assert.doesNotThrow(function() {
              let store = { dispatch: undefined };
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch);
            });
          });

          it("[EMITS] emits an UnexpectedRuntimeError error if 'dispatch' is undefined", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi
            );
            // assert.doesNotThrow(function() {
            let store = { dispatch: undefined };
            sinon.spy(document, "dispatchEvent");
            const thunkFunction = actionCreators[crudAct]();
            thunkFunction(store.dispatch);
            assert.equal(
              document.dispatchEvent.getCall(0).args[0].type,
              "unexpectedruntimeerror"
            );

            // });
          });
        });
      });
    });
  });

  describe("[OPERATION]", () => {
    describe("[THUNK-SPECIFIC] All crud thunks must dispatch an initial action, and a result action", function() {
      ["create", "read", "update", "delete"].forEach(crudAct => {
        describe(crudAct, () => {
          describe(`${crudAct} must fire an initial action`, () => {
            let actionCreators;
            const { mockActionTypes, mockRestApi } = createMocks();

            beforeEach(function() {
              actionCreators = actionCreatorsFactory(
                mockActionTypes,
                mockRestApi
              );
            });

            it(`"${crudAct}" should call store.dispatch at least once`, () => {
              // 'dispatch' has been called at least once

              let store = { dispatch() {} };

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch);

              const dispatchCall = store.dispatch.getCall(0);
              assert.notEqual(dispatchCall, null);
            });

            it(`"${crudAct}" should call store.dispatch firstly with a "bare" action type - without any state`, () => {
              let store = { dispatch() {} };
              const expectedActionType = mockActionTypes[crudAct.toUpperCase()];

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch);

              const dispatchCall = store.dispatch.getCall(0);
              const dispatchedAction = dispatchCall.args[0];
              assert.equal(dispatchedAction.type, expectedActionType);
            });

            it(`"${crudAct}" should carry the payload on the initial action`, () => {
              let store = { dispatch() {} };
              let someTestPayload = { testPayload: true };

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct](someTestPayload);
              thunkFunction(store.dispatch);

              const dispatchCall = store.dispatch.getCall(0);
              const dispatchedAction = dispatchCall.args[0];
              assert.deepEqual(dispatchedAction.payload, someTestPayload);
            });
          });

          describe(`${crudAct} must call the correct rest api call`, () => {
            it(`"${crudAct}" should call the corresponding rest api method`, done => {
              let { mockActionTypes, mockRestApi } = createMocks();
              sinon.spy(mockRestApi, crudAct);

              let actionCreators = actionCreatorsFactory(
                mockActionTypes,
                mockRestApi
              );

              let store = { dispatch() {} };
              let someTestPayload = { testPayload: true };

              const thunkFunction = actionCreators[crudAct](someTestPayload);
              thunkFunction(store.dispatch).then(function() {
                const restCall = mockRestApi[crudAct].getCall(0);
                assert.notEqual(restCall, null);
                done();
              });
            });

            it(`"${crudAct}" should call the corresponding rest api method with the payload as an argument`, done => {
              let { mockActionTypes, mockRestApi } = createMocks();
              sinon.spy(mockRestApi, crudAct);

              let actionCreators = actionCreatorsFactory(
                mockActionTypes,
                mockRestApi
              );

              let store = { dispatch() {} };
              let someTestPayload = { testPayload: true };

              const thunkFunction = actionCreators[crudAct](someTestPayload);
              thunkFunction(store.dispatch).then(function() {
                const restCall = mockRestApi[crudAct].getCall(0);
                const restCallArgument = restCall.args[0];
                assert.deepEqual(restCallArgument, someTestPayload);
                done();
              });
            });
          });

          describe(`${crudAct} must fire a 'success' type action, when the promise resolves`, function() {
            let actionCreators;
            const { mockActionTypes, mockRestApi } = createMocks();

            beforeEach(function() {
              actionCreators = actionCreatorsFactory(
                mockActionTypes,
                mockRestApi
              );
            });

            it(`"${crudAct}" should call store.dispatch at least 2 times`, done => {
              // 'dispatch' has been called at least once

              let store = { dispatch() {} };
              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch).then(function() {
                const dispatchCall = store.dispatch.getCall(1);

                assert.notEqual(dispatchCall, null);
                done();
              });
            });

            it(`"${crudAct}" should call store.dispatch with a 'success' action type the second time, when the promise resolves`, done => {
              let store = { dispatch() {} };
              const expectedActionType =
                mockActionTypes[crudAct.toUpperCase() + "__SUCCESS"];

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();

              thunkFunction(store.dispatch).then(function() {
                const dispatchCall = store.dispatch.getCall(1);
                const dispatchedAction = dispatchCall.args[0];
                assert.notEqual(typeof dispatchedAction.type, "undefined");
                assert.equal(dispatchedAction.type, expectedActionType);
                done();
              });
            });

            it(`"${crudAct}" should carry the payload on the 'success' action`, done => {
              let store = { dispatch() {} };
              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch).then(function() {
                const dispatchCall = store.dispatch.getCall(1);
                const dispatchedAction = dispatchCall.args[0];
                assert.deepEqual(dispatchedAction.payload, { test: true });
                done();
              });
            });
          });

          describe(`${crudAct} must fire a 'failure' type action, when the promise rejects`, function() {
            let actionCreators;
            const { mockActionTypes, mockRestApi } = createMocks(true);

            beforeEach(function() {
              actionCreators = actionCreatorsFactory(
                mockActionTypes,
                mockRestApi
              );
            });

            it(`"${crudAct}" should call store.dispatch with a 'failure' action type the second time, when the promise rejects`, done => {
              let store = { dispatch() {} };

              const expectedActionType =
                mockActionTypes[crudAct.toUpperCase() + "__FAILURE"];

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();

              thunkFunction(store.dispatch).then(() => {
                const dispatchCall = store.dispatch.getCall(1);
                const dispatchedAction = dispatchCall.args[0];
                assert.notEqual(typeof dispatchedAction.type, "undefined");
                assert.equal(dispatchedAction.type, expectedActionType);
                done();
              });
            });

            it(`"${crudAct}" should carry the error on the 'failure' action`, done => {
              let store = { dispatch() {} };

              sinon.spy(store, "dispatch");
              const thunkFunction = actionCreators[crudAct]();
              thunkFunction(store.dispatch).then(function() {
                const dispatchCall = store.dispatch.getCall(1);
                const dispatchedAction = dispatchCall.args[0];
                assert.deepEqual(dispatchedAction.error, { test: false });
                done();
              });
            });
          });
        });
      });
    });
  });
});
