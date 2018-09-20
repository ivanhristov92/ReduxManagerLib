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

  // describe("The factory function must return an object with the crud rest calls", function() {
  //   it("returns an object", () => {
  //     let restApi = restApiFactory();
  //     assert.equal(typeof restApi, "object");
  //   });
  //
  //   it("returns a non-empty object", () => {
  //     let restApi = restApiFactory({}, {}, {});
  //     assert.equal(_.isEmpty(restApi), false);
  //   });
  //
  //   describe("The factory function must return an object with all crud rest calls", function() {
  //     const propNotFound = " property was not found";
  //
  //     ["create", "read", "update", "delete"].forEach(crudAct => {
  //       it(`the factory returns an object with a '${crudAct}' function`, () => {
  //         let restApi = restApiFactory();
  //         assert.equal(
  //           _.has(crudAct, restApi),
  //           true,
  //           `${crudAct} ${propNotFound}`
  //         );
  //         assert.equal(typeof restApi[crudAct], "function");
  //       });
  //
  //       it(`the '${crudAct}' function must return a Promise`, () => {
  //         let restApi = restApiFactory();
  //         let promise = restApi[crudAct]();
  //
  //         assert.equal(
  //           typeof promise.then,
  //           "function",
  //           `${crudAct} does not return a Promise`
  //         );
  //       });
  //     });
  //   });
  // });
});
