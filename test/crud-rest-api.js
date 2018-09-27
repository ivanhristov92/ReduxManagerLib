import restApiFactory from "../crud-rest-api";
var assert = require("assert");
var sinon = require("sinon");
import * as _ from "ramda";

describe("CRUD Rest Api", () => {
  describe("[EXPORTS INTERFACE] The module must expose a factory function, that creates the rest api functions for a model", function() {
    it("The module should default export a function", () => {
      assert.equal(typeof restApiFactory, "function");
    });

    it("returns an object", () => {
      let restApi = restApiFactory();
      assert.equal(typeof restApi, "object");
    });

    it("returns a non-empty object", () => {
      let restApi = restApiFactory({}, {}, {});
      assert.equal(_.isEmpty(restApi), false);
    });

    ["create", "read", "update", "delete"].forEach(crudAct => {
      const propNotFound = " property was not found";

      it(`the factory returns an object with a '${crudAct}' function`, () => {
        let restApi = restApiFactory();
        assert.equal(
          _.has(crudAct, restApi),
          true,
          `${crudAct} ${propNotFound}`
        );
        assert.equal(typeof restApi[crudAct], "function");
      });
    });
  });

  describe("[METHOD SIGNATURES] 'create' has the right signature", function() {
    describe(`the function must require as a 0 argument - an array of objects`, () => {
      it("should throw if no argument is provided", () => {
        let restApi = restApiFactory();

        assert.throws(function() {
          let promise = restApi.create();
        }, TypeError);
      });
      it("should throw if it is passed an empty array", () => {
        let restApi = restApiFactory();

        assert.throws(function() {
          let promise = restApi.create([]);
        }, TypeError);
      });

      it(`the 'create' function must return a Promise`, () => {
        let restApi = restApiFactory();
        let promise = restApi.create([{ test: 1 }]);

        assert.equal(
          typeof promise.then,
          "function",
          `$create does not return a Promise`
        );
      });
    });

    describe(`the resolved data must be normalized`, () => {
      it("should return normalized data with 1 entry when 1 object is created", done => {
        let restApi = restApiFactory();

        restApi.create([{ test: 1 }]).then(response => {
          assert.equal(typeof response.byId, "object");
          assert.equal(_.keys(response.byId).length, 1);
          done();
        });
      });
      it("should return normalized data with 2 entry when 2 object is created", done => {
        let restApi = restApiFactory();

        restApi.create([{ test: 1 }, { test: 2 }]).then(response => {
          assert.equal(typeof response.byId, "object");
          assert.equal(_.keys(response.byId).length, 2);
          done();
        });
      });
      it("should return normalized data with 3 entry when 3 object is created", done => {
        let restApi = restApiFactory();

        restApi
          .create([{ test: 1 }, { test: 2 }, { test: 3 }])
          .then(response => {
            assert.equal(typeof response.byId, "object");
            assert.equal(_.keys(response.byId).length, 3);
            done();
          });
      });
    });
  });
});
