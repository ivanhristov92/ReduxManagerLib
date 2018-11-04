import { bindSelectorsToState } from "../utils/bind-selectors-to-state";
var assert = require("assert");
var sinon = require("sinon");

describe("CRUD Action Creators", () => {
  describe("[EXPORTS] a function", function() {
    it("The module should name export a function", () => {
      assert.equal(typeof bindSelectorsToState, "function");
    });
  });

  describe("[RUNTIME SIGNATURE]", function() {
    describe("[EXPECTS]", function() {});
    describe("[RETURNS]", function() {});
  });

  describe("[OPERATION]", () => {});
});
