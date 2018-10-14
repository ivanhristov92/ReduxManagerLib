import * as _ from "ramda";
import {
  ModuleInitializationTypeError,
  dispatchAnUnexpectedErrorEvent
} from "./crud-error-types";

export default function reducerFactory(actionTypes, customErrorHandler) {
  if (!actionTypes || typeof actionTypes !== "object") {
    throw new ModuleInitializationTypeError(
      `'actionTypes' must be a valid ActionTypes object`
    );
  }

  const a = actionTypes;
  ["CREATE", "READ", "UPDATE", "DELETE"]
    .reduce((acc, crudAct) => {
      return [...acc, crudAct, crudAct + "__SUCCESS", crudAct + "__FAILURE"];
    }, [])
    .forEach(crudAct => {
      if (!actionTypes[crudAct]) {
        throw new ModuleInitializationTypeError(
          `"${crudAct}" is not found in actionTypes`
        );
      }
    });

  if (
    typeof customErrorHandler !== "undefined" &&
    typeof customErrorHandler !== "function"
  ) {
    throw new ModuleInitializationTypeError(
      "setRuntimeErrorHandler expects a function, instead it received " +
        typeof customErrorHandler
    );
  }

  let runtimeErrorHandler =
    customErrorHandler ||
    function defaultRuntimeErrorHandler(error, state, action) {
      try {
        dispatchAnUnexpectedErrorEvent(error);

        return {
          ...state,
          error: error
        };
      } catch (err) {
        //emit global error
        dispatchAnUnexpectedErrorEvent(err);
      }
    };

  function reducer(
    state = { byId: {}, isFetching: false, error: null },
    action
  ) {
    try {
      if (
        (typeof state !== "undefined" && typeof state !== "object") ||
        Array.isArray(state) ||
        !state
      ) {
        throw new TypeError(
          "'state' must be an object or undefined. Instead received: " + state
        );
      }

      if (typeof action !== "object" || !action.type) {
        throw new TypeError("'not a valid action'");
      }

      function createReadUpdateDelete(state, action) {
        return {
          ...state,
          isFetching: true,
          error: null
        };
      }

      function successfulCreateReadUpdate(state, action) {
        return {
          ...state,
          byId: {
            ...state.byId,
            ...action.payload.byId
          },
          isFetching: false,
          error: null
        };
      }

      function failedCreateReadUpdateDelete(state, action) {
        if (!action.error) {
          throw new TypeError(
            "failure action needs to have an 'error' attribute"
          );
        }
        return {
          ...state,
          isFetching: false,
          error: action.error
        };
      }

      function successfulDelete(state, action) {
        return {
          ...state,
          byId: _.omit([action.payload.id], state.byId),
          isFetching: false,
          error: null
        };
      }

      let does = {
        [a["CREATE"]]: createReadUpdateDelete,
        [a["READ"]]: createReadUpdateDelete,
        [a["UPDATE"]]: createReadUpdateDelete,
        [a["DELETE"]]: createReadUpdateDelete,

        [a["CREATE__SUCCESS"]]: successfulCreateReadUpdate,
        [a["READ__SUCCESS"]]: successfulCreateReadUpdate,
        [a["UPDATE__SUCCESS"]]: successfulCreateReadUpdate,
        [a["DELETE__SUCCESS"]]: successfulDelete,

        [["CREATE__FAILURE"]]: failedCreateReadUpdateDelete,
        [["READ__FAILURE"]]: failedCreateReadUpdateDelete,
        [["UPDATE__FAILURE"]]: failedCreateReadUpdateDelete,
        [["DELETE__FAILURE"]]: failedCreateReadUpdateDelete
      };

      if (does[action.type]) {
        return does[action.type](state, action);
      } else {
        return state;
      }
    } catch (error) {
      // unexpected run-time error
      return runtimeErrorHandler(error, state, action);
    }
  }

  reducer.extend = function() {};
  return reducer;
}
