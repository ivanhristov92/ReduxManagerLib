// @flow

import { typeCheckOptions, defaultRuntimeErrorHandler } from "./utils";
import type { RMLSelectorsFactory } from "./crud-selectors.flow";
import type { RMLOperationStates, RMLState } from "./crud-reducer.flow";

function selectorsFactory(options) {
  typeCheckOptions(options);

  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

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

  function getError(state) {
    try {
      typeCheckState(state);
      return state.error;
    } catch (error) {
      runtimeErrorHandler(error, { state, selector: "getSome" });
      return {};
    }
  }

  function getOperationStates(state: RMLState) {
    try {
      typeCheckState(state);
      let toReturn = {
        create: state.create,
        read: state.read,
        update: state.update,
        delete: state.delete
      };
      return toReturn;
    } catch (error) {
      try {
        runtimeErrorHandler(error, {
          state,
          selector: "getOperationStates"
        });
      } catch (e) {}

      return {};
    }
  }

  let additionalSelectors = (options && options.additional) || {};
  return Object.assign(
    {
      getAll,
      getOne,
      getSome,
      getError,
      getOperationStates
    },
    additionalSelectors
  );
}

const factory: RMLSelectorsFactory = selectorsFactory;
export default factory;

function typeCheckState(state) {
  if (!isObject(state) || Object.keys(state).length === 0) {
    throw new TypeError(
      `Expected state to be a valid State object, instead received ${typeof state}: ${state}`
    );
  }
  if (!isObject(state.byId)) {
    throw new TypeError(
      `Expected state to have a 'byId' property, instead received ${typeof state}: ${state}`
    );
  }
  ["create", "read", "update", "delete"].forEach(operation => {
    if (typeof state[operation] !== "string") {
      throw new TypeError(
        `Expected state to have an '${operation}' property to be a string, instead received ${typeof state}: ${state}`
      );
    }
  });
}

// helpers
function isObject(value) {
  return typeof value === "object" && !Array.isArray(value) && value;
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
