import * as _ from "ramda";
import {
  ModuleInitializationTypeError,
  dispatchAnUnexpectedErrorEvent
} from "./crud-error-types";

import { typeCheckOptions, isObject, isOptionalObject } from "./utils";

/////////////////////////////////////////////////////////////////////
////// REDUCER FACTORY //////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
const STATES = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE"
};

export default function reducerFactory(actionTypes, options) {
  typeCheckActionTypes(actionTypes);
  typeCheckOptions(options);
  typeCheckDefaultState(options);
  options = options || {};

  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

  let does = Object.assign(
    {
      [actionTypes["CREATE"]]: createReadUpdateDelete("create"),
      [actionTypes["READ"]]: createReadUpdateDelete("read"),
      [actionTypes["UPDATE"]]: createReadUpdateDelete("update"),
      [actionTypes["DELETE"]]: createReadUpdateDelete("delete"),

      [actionTypes["CREATE__SUCCESS"]]: successfulCreateReadUpdate("create"),
      [actionTypes["READ__SUCCESS"]]: successfulCreateReadUpdate("read"),
      [actionTypes["UPDATE__SUCCESS"]]: successfulCreateReadUpdate("update"),
      [actionTypes["DELETE__SUCCESS"]]: successfulDelete,

      [actionTypes["CREATE__FAILURE"]]: failedCreateReadUpdateDelete("create"),
      [actionTypes["READ__FAILURE"]]: failedCreateReadUpdateDelete("read"),
      [actionTypes["UPDATE__FAILURE"]]: failedCreateReadUpdateDelete("update"),
      [actionTypes["DELETE__FAILURE"]]: failedCreateReadUpdateDelete("delete")
    },
    options.additional || {}
  );

  const additioonalDefaultState = options ? options.defaultState || {} : {};
  function reducer(
    // state = { byId: {}, isFetching: false, error: null },
    state = {
      byId: {},
      error: null,
      create: STATES.IDLE,
      read: STATES.IDLE,
      update: STATES.IDLE,
      delete: STATES.IDLE,
      ...additioonalDefaultState
    },
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

function createReadUpdateDelete(operation) {
  return function createReadUpdateDelete(state, action) {
    return {
      ...state,
      [operation]: STATES.LOADING,
      error: null
    };
  };
}

function successfulCreateReadUpdate(operation) {
  return function successfulCreateReadUpdate(state, action) {
    return {
      ...state,
      byId: {
        ...state.byId,
        ...action.payload.byId
      },
      [operation]: STATES.SUCCESS,
      error: null
    };
  };
}

function failedCreateReadUpdateDelete(operation) {
  return function failedCreateReadUpdateDelete(state, action) {
    if (!action.error) {
      throw new TypeError("failure action needs to have an 'error' attribute");
    }
    return {
      ...state,
      [operation]: STATES.FAILURE,
      error: action.error
    };
  };
}

function successfulDelete(state, action) {
  return {
    ...state,
    byId: _.omit([action.payload.id], state.byId),
    delete: STATES.SUCCESS,
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

function typeCheckDefaultState(options) {
  if (isObject(options) && options.hasOwnProperty("defaultState")) {
    if (!isObject(options.defaultState)) {
      throw new TypeError(
        `Expected options.defaultState to be an object, instead received: ${typeof options.defaultState}: ${
          options.defaultState
        }`
      );
    }
  }
}
