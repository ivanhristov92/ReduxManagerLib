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
import createMocks from "./create-mocks";

import * as _ from "ramda";
import { ModuleInitializationTypeError } from "../crud-error-types";

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

        it("[ACCEPTS] accepts an ActionTypes object for 'actionTypes'", () => {
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

      describe("[EXPECTS] 'options' object is optional", () => {
        it("[ACCEPTS] undefined for 'options'", () => {
          assert.doesNotThrow(function() {
            actionCreatorsFactory(mockActionTypes, mockRestApi);
          }, Error);
        });

        it("[ACCEPTS][CORRECT TYPE] accepts {additional: {testMe(){}}}", () => {
          assert.doesNotThrow(function() {
            actionCreatorsFactory(mockActionTypes, mockRestApi, {
              additional: { testMe() {} }
            });
          });
        });

        it("[ACCEPTS][CORRECT TYPE] accepts {additional: {testMe:function(){}}, customErrorHandler: function(){}}", () => {
          assert.doesNotThrow(function() {
            actionCreatorsFactory(mockActionTypes, mockRestApi, {
              additional: { testMe: function() {} },
              customErrorHandler() {}
            });
          });
        });

        [[], "", "test", function() {}, null, false, true, 100, 0].forEach(
          (value, index) => {
            it(`${index} [THROWS] throws a ModuleInitializationTypeError if 'options.additional' is not an object or undefined, but ${typeof value} : ${value}`, () => {
              try {
                actionCreatorsFactory(mockActionTypes, mockRestApi, {
                  additional: value
                });
                throw new Error("should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          }
        );
        [[], "", "test", null, false, true, 100, 0, {}].forEach(
          (value, index) => {
            it(`${index} [THROWS] throws a ModuleInitializationTypeError if 'options.customErrorHandler' is not a function or undefined, but ${typeof value} : ${value}`, () => {
              try {
                actionCreatorsFactory(mockActionTypes, mockRestApi, {
                  customErrorHandler: value
                });
                throw new Error("should have thrown");
              } catch (err) {
                assert.equal(err.name, "ModuleInitializationTypeError");
              }
            });
          }
        );
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

        describe("[CORRECT TYPE] - contains the additional actions", () => {
          it("The returned object contains the additional actions", () => {
            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi,
              {
                additional: {
                  testMe() {},
                  testMe2() {}
                }
              }
            );

            assert.equal(typeof actionCreators.testMe, "function");
            assert.equal(typeof actionCreators.testMe2, "function");
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

          it("[CALLS] the errorHandler function if 'dispatch' is undefined", () => {
            let options = {
              customErrorHandler() {}
            };
            sinon.spy(options, "customErrorHandler");

            let actionCreators = actionCreatorsFactory(
              mockActionTypes,
              mockRestApi,
              options
            );

            let store = { dispatch: undefined };
            const thunkFunction = actionCreators[crudAct]();
            thunkFunction(store.dispatch);
            const errorHandlerCall = options.customErrorHandler.getCall(0);
            assert.notEqual(errorHandlerCall, null);
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
