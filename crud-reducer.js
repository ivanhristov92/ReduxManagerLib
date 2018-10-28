import * as _ from "ramda";
import {
  ModuleInitializationTypeError,
  dispatchAnUnexpectedErrorEvent
} from "./crud-error-types";

import { typeCheckOptions, isObject, isOptionalObject } from "./utils";

/////////////////////////////////////////////////////////////////////
////// REDUCER FACTORY //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function reducerFactory(actionTypes, options) {
  typeCheckActionTypes(actionTypes);
  typeCheckOptions(options);
  options = options || {};

  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

  let does = Object.assign(
    {
      [actionTypes["CREATE"]]: createReadUpdateDelete,
      [actionTypes["READ"]]: createReadUpdateDelete,
      [actionTypes["UPDATE"]]: createReadUpdateDelete,
      [actionTypes["DELETE"]]: createReadUpdateDelete,

      [actionTypes["CREATE__SUCCESS"]]: successfulCreateReadUpdate,
      [actionTypes["READ__SUCCESS"]]: successfulCreateReadUpdate,
      [actionTypes["UPDATE__SUCCESS"]]: successfulCreateReadUpdate,
      [actionTypes["DELETE__SUCCESS"]]: successfulDelete,

      [actionTypes["CREATE__FAILURE"]]: failedCreateReadUpdateDelete,
      [actionTypes["READ__FAILURE"]]: failedCreateReadUpdateDelete,
      [actionTypes["UPDATE__FAILURE"]]: failedCreateReadUpdateDelete,
      [actionTypes["DELETE__FAILURE"]]: failedCreateReadUpdateDelete
    },
    options.additional || {}
  );

  function reducer(
    state = { byId: {}, isFetching: false, error: null },
    action
  ) {
    try {
      typeCheckState(state);
      typeCheckAction(action);

      if (does[action.type]) {
        return does[action.type](state, action);
      } else {
        return state;
      }
    } catch (error) {
      // unexpected run-time error
      return runtimeErrorHandler(error, { state, action });
    }
  }

  return reducer;
}

/////////////////////////////////////////////////////////////////////
////// COMMON INTERNAL REDUCERS /////////////////////////////////////
/////////////////////////////////////////////////////////////////////

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
    throw new TypeError("failure action needs to have an 'error' attribute");
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

/////////////////////////////////////////////////////////////////////
////// DEFAULT RUNTIME ERROR HANDLER ////////////////////////////////
/////////////////////////////////////////////////////////////////////

function defaultRuntimeErrorHandler(error, { state, action }) {
  try {
    dispatchAnUnexpectedErrorEvent(error, { state, action });

    return {
      ...state,
      error: error
    };
  } catch (err) {
    //emit global error
    dispatchAnUnexpectedErrorEvent(err, { state, action });
  }
}

/////////////////////////////////////////////////////////////////////
////// TYPE CHECKERS ////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

// [MODULE INITIALIZATION]

function typeCheckActionTypes(actionTypes) {
  if (!isObject(actionTypes)) {
    throw new ModuleInitializationTypeError(
      `'actionTypes' must be a valid ActionTypes object`
    );
  }

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
}

// [RUNTIME]
function typeCheckState(state) {
  if (!isOptionalObject(state)) {
    throw new TypeError(
      "'state' must be an object or undefined. Instead received: " + state
    );
  }
}

function typeCheckAction(action) {
  if (!isObject(action) || !action.type) {
    throw new TypeError("'not a valid action'");
  }
}
