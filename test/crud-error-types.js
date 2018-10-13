var assert = require("assert");
import * as errorTypes from "../crud-error-types";

describe("CRUD Error Types", () => {
  it("[EXPORTS] The module should export an error of type 'ModuleInitializationTypeError'", () => {
    assert.notEqual(
      typeof errorTypes.ModuleInitializationTypeError,
      "undefined"
    );
  });

  it("[EXPORTS] The module should export an error of type 'UnexpectedRuntimeError'", () => {
    assert.notEqual(typeof errorTypes.UnexpectedRuntimeError, "undefined");
  });
});
