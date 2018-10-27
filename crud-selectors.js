import {
  dispatchAnUnexpectedErrorEvent,
  ModuleInitializationTypeError
} from "./crud-error-types";

export default function selectorsFactory(options) {
  typeCheckOptions(options);

  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

  function defaultRuntimeErrorHandler(error, { state, action }) {
    dispatchAnUnexpectedErrorEvent(error, { state, action });
  }

  function getAll(state, asArray) {
    try {
      return asArray ? Object.values(state.byId) : state.byId;
    } catch (error) {
      runtimeErrorHandler(error, { state, asArray, selector: "getAll" });
      return asArray ? [] : {};
    }
  }

  function getOne(state, id) {
    try {
      return state.byId[id];
    } catch (error) {
      runtimeErrorHandler(error, { state, id, selector: "getOne" });
      return {};
    }
  }

  function getSome(state, ids = []) {
    try {
      return ids.map(id => state.byId[id]);
    } catch (error) {
      runtimeErrorHandler(error, { state, ids, selector: "getSome" });
      return [];
    }
  }

  return {
    getAll,
    getOne,
    getSome
  };
}

function typeCheckOptions(options) {
  if (!isOptionalObject(options)) {
    throw new ModuleInitializationTypeError(
      `Expected an object or undefined, instead received ${typeof options}: ${options}`
    );
  }

  if (
    isObject(options) &&
    typeof options.customErrorHandler !== "undefined" &&
    typeof options.customErrorHandler !== "function"
  ) {
    throw new ModuleInitializationTypeError(
      `Expected an 'customErrorHandler' to be a function, instead received ${typeof options.customErrorHandler}: ${
        options.customErrorHandler
      }`
    );
  }
}

// helpers
function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value;
}

function isOptionalObject(value) {
  return typeof value === "undefined" || isObject(value);
}
