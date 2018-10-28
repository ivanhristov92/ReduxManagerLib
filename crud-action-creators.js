/*
 ** Contents
 ** --------
 ** 0. Imports
 ** 1. Internal Thunk Factory
 ** 2. Action Creators Factory
 **/

import * as _ from "ramda";
import {
  dispatchAnUnexpectedErrorEvent,
  ModuleInitializationTypeError
} from "./crud-error-types";
import { typeCheckExtensions } from "./utils";

//////////////////////////////////////////////////////
////// INTERNAL THUNK FACTORY ////////////////////////
//////////////////////////////////////////////////////

const _thunkFactory = _.curry(function(
  actionTypes,
  restApiInstance,
  crudMethod
) {
  let actionTypeKey = crudMethod.toUpperCase();
  let actionTypeSuccessKey = actionTypeKey + "__SUCCESS";
  let actionTypeFailureKey = actionTypeKey + "__FAILURE";

  [actionTypeKey, actionTypeSuccessKey, actionTypeFailureKey].forEach(
    actKey => {
      if (!actionTypes[actKey]) {
        throw new TypeError(
          `"${actKey}" is not found in the actionTypes object`
        );
      }
    }
  );

  if (!restApiInstance[crudMethod]) {
    throw new TypeError(
      `"${actionTypeKey}" is not found in the restApi object`
    );
  }

  return function crudThunk(payload) {
    return function _thunk_(dispatch) {
      try {
        dispatch({ type: actionTypes[actionTypeKey], payload });
        return restApiInstance[crudMethod](payload)
          .then(response => {
            dispatch({
              type: actionTypes[actionTypeSuccessKey],
              payload: response
            });
          })
          .catch(error => {
            dispatch({
              type: actionTypes[actionTypeFailureKey],
              error: error
            });
          });
      } catch (error) {
        // emit a global error event
        dispatchAnUnexpectedErrorEvent(error, {
          crudMethod,
          payload,
          actionTyp: actionTypes[actionTypeKey],
          actionTypeKey
        });
      }
    };
  };
});

/////////////////////////////////////////////////////////////////////
////// ACTION CREATORS FACTORY //////////////////////////////////////
/////////////////////////////////////////////////////////////////////

export default function actionCreatorsFactory(
  _actionTypes,
  _restApiInstance,
  options
) {
  if (!_actionTypes) {
    throw new ModuleInitializationTypeError(
      "'actionTypes' is required as an argument"
    );
  }

  if (!_restApiInstance) {
    throw new ModuleInitializationTypeError(
      "'restApiInstance' is required as an argument"
    );
  }
  options = options || {};
  typeCheckOptions(options);

  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

  let actionTypes = _.clone(_actionTypes);
  let restApiInstance = _.clone(_restApiInstance);

  let thunkFactory = _thunkFactory(actionTypes, restApiInstance);

  let actionCreators = {
    create: thunkFactory("create"),
    read: thunkFactory("read"),
    update: thunkFactory("update"),
    delete: thunkFactory("delete")
  };

  return Object.assign(actionCreators, options.additional || {});
}

function defaultRuntimeErrorHandler(error, details) {
  dispatchAnUnexpectedErrorEvent(error, details);
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
        if (typeof value !== "function") {
          throw new ModuleInitializationTypeError(
            `Expected 'options.additional' to be an object containing functions, instead received  ${typeof value}: ${value}`
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
