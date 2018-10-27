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
      typeCheckState(state);
      return asArray ? Object.values(state.byId) : state.byId;
    } catch (error) {
      runtimeErrorHandler(error, { state, asArray, selector: "getAll" });
      return asArray ? [] : {};
    }
  }

  function getOne(state, id) {
    try {
      typeCheckState(state);
      return state.byId[id];
    } catch (error) {
      runtimeErrorHandler(error, { state, id, selector: "getOne" });
      return {};
    }
  }

  function getSome(state, ids = []) {
    try {
      typeCheckState(state);
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

  if (isObject(options) && !isOptionalFunction(options.customErrorHandler)) {
    throw new ModuleInitializationTypeError(
      `Expected an 'customErrorHandler' to be a function, instead received ${typeof options.customErrorHandler}: ${
        options.customErrorHandler
      }`
    );
  }
}

function typeCheckState(state) {
  if (!isObject(state)) {
    throw new TypeError(
      `Expected state to be a valid State object, instead received ${typeof state}: ${"" +
        state}`
    );
  }
  if (!isObject(state.byId)) {
    throw new TypeError(
      `Expected state to have a 'byId' property, instead received ${typeof state}: ${state}`
    );
  }
  if (typeof state.isFetching !== "boolean") {
    throw new TypeError(
      `Expected state to have an 'isFetching' property, instead received ${typeof state}: ${state}`
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

function isOptionalFunction(func) {
  return typeof func === "undefined" || typeof func === "function";
}
