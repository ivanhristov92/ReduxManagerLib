import selectorsFactory from "../crud-selectors";
var assert = require("assert");
import * as _ from "ramda";

describe("CRUD SELECTORS", () => {
  describe("[EXPORTS]", () => {
    it("selectorsFactory function", () => {
      assert.equal(typeof selectorsFactory, "function");
    });
  });

  describe("[MODULE INITIALIZATION SIGNATURE]", () => {
    describe("[RETURNS] an object with selectors", () => {
      it("[CORRECT TYPE] returns an object", () => {
        assert.equal(typeof selectorsFactory(), "object");
        assert.equal(Array.isArray(selectorsFactory()), false);
        assert.notEqual(selectorsFactory(), null);
      });

      ["getOne", "getSome", "getAll"].forEach(method => {
        it(`[CORRECT TYPE] has a ${method} function`, () => {
          assert.equal(typeof selectorsFactory()[method], "function");
        });
      });
    });
  });

  describe("[RUNTIME SIGNATURE]", () => {
    ["getOne", "getSome", "getAll"].forEach(method => {
      describe(method, () => {
        describe("[EXPECTS]", () => {
          describe("state as 0th argument", () => {
            it("[ACCEPTS] an object", () => {});
            it("[THORWS][HANDLES]", () => {});
          });
        });
      });
    });
  });
});
