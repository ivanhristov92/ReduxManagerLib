import * as _ from "ramda";
import { ModuleInitializationTypeError } from "./crud-error-types";
import { typeCheckExtensions } from "./utils";

export default function actionTypesFactory(modelName, options) {
  if (typeof modelName !== "string" || modelName === "") {
    throw new ModuleInitializationTypeError(
      `'modelName' is required to be a non-empty string, instead got ${typeof modelName} : ${modelName}`
    );
  }

  typeCheckOptions(options);
  options = options || {};

  const addModelName = _.map(actionTypeValue => {
    return `${modelName}/${actionTypeValue}`;
  });

  let actionTypes = addModelName({
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
  });

  let extendedActionTypes = Object.assign(
    actionTypes,
    options.additional || {}
  );
  return extendedActionTypes;
}

function typeCheckOptions(options) {
  if (!isOptionalObject(options)) {
    throw new ModuleInitializationTypeError(
      `Expected an object or undefined, instead received ${typeof options}: ${options}`
    );
  }

  if (isObject(options) && !isOptionalFunction(options.customErrorHandler)) {
    throw new ModuleInitializationTypeError(
      `Expected an 'customErrorHandler' to be a function, instead received ${typeof options.customErrorHandler}: ${
        options.customErrorHandler
      }`
    );
  }

  if (isObject(options)) {
    if (!isOptionalObject(options.additional)) {
      throw new ModuleInitializationTypeError(
        `Expected 'options.additional' to be an object, instead received ${typeof options.additional}: ${
          options.additional
        }`
      );
    } else {
      Object.values(options.additional || {}).forEach(value => {
        if (typeof value !== "string") {
          throw new ModuleInitializationTypeError(
            `Expected 'options.additional' to be an object containing strings, instead received  ${typeof value}: ${value}`
          );
        }
      });
    }
  }
}

// helpers
function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value;
}

function isOptionalObject(value) {
  return typeof value === "undefined" || isObject(value);
}

function isOptionalFunction(func) {
  return typeof func === "undefined" || typeof func === "function";
}
