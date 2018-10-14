import * as _ from "ramda";
import {
  ModuleInitializationTypeError,
  dispatchAnUnexpectedErrorEvent
} from "./crud-error-types";

export default function reducerFactory(actionTypes, customErrorHandler) {
  const a = actionTypes;
  ["CREATE", "READ", "UPDATE", "DELETE"]
    .reduce((acc, crudAct) => {
      return [...acc, crudAct, crudAct + "__SUCCESS", crudAct + "__FAILURE"];
    }, [])
    .forEach(crudAct => {
      if (!actionTypes[crudAct]) {
        throw new TypeError(`"${crudAct}" is not found in actionTypes`);
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

      if (!action.type) {
        throw new TypeError("'not a valid action'");
      }

      switch (action.type) {
        case (function() {
          return a["CREATE"];
        })():
        case a["READ"]:
        case a["UPDATE"]:
        case a["DELETE"]:
          return {
            ...state,
            isFetching: true,
            error: null
          };
        case a["CREATE__SUCCESS"]:
        case a["READ__SUCCESS"]:
        case a["UPDATE__SUCCESS"]:
          return {
            ...state,
            byId: {
              ...state.byId,
              ...action.payload.byId
            },
            isFetching: false,
            error: null
          };
        case a["CREATE__FAILURE"]:
        case a["READ__FAILURE"]:
        case a["UPDATE__FAILURE"]:
        case a["DELETE__FAILURE"]: {
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

        case a["DELETE__SUCCESS"]:
          return {
            ...state,
            byId: _.omit([action.payload.id], state.byId),
            isFetching: false,
            error: null
          };

        default:
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
