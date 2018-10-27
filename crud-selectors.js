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

  function getAll(state, format) {
    try {
      typeCheckState(state);
      typeCheckFormat(format);

      return format === "map" ? state.byId : Object.values(state.byId);
    } catch (error) {
      runtimeErrorHandler(error, { state, format, selector: "getAll" });
      return format === "map" ? {} : [];
    }
  }

  function getOne(state, id) {
    try {
      typeCheckState(state);
      typeCheckId(id);
      return state.byId[id];
    } catch (error) {
      runtimeErrorHandler(error, { state, id, selector: "getOne" });
      return {};
    }
  }

  function getSome(state, ids, format) {
    try {
      typeCheckState(state);
      typeCheckIds(ids);
      typeCheckFormat(format);
      if (format === "map") {
        return ids.reduce((acc, id) => {
          return Object.assign(acc, { [id]: state.byId[id] });
        }, {});
      } else {
        return ids.map(id => state.byId[id]);
      }
    } catch (error) {
      runtimeErrorHandler(error, { state, ids, format, selector: "getSome" });
      return format === "map" ? {} : [];
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

function typeCheckIds(ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new TypeError(
      `Expected ids to be a non-empty array of strings or a numbers, instead receive ${typeof ids} ${ids}`
    );
  }
  ids.forEach(typeCheckId);
}

function typeCheckId(id) {
  if (!isValidId(id)) {
    throw new TypeError(
      `Expected id to be a non-empty string or a number, instead receive ${typeof id} ${id}`
    );
  }
}

function isValidId(id) {
  if (id === "") {
    return false;
  }
  if (typeof id !== "string" && typeof id !== "number") {
    return false;
  }
  return true;
}

function typeCheckFormat(format) {
  if (typeof format !== "undefined") {
    if (format !== "map" && format !== "array") {
      throw new TypeError(
        `Expected format to be "array" or "map", instead receive ${typeof format} ${format}`
      );
    }
  }
}
