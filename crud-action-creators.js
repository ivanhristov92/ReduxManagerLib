// @flow

/*
 ** Contents
 ** --------
 ** 0. Imports
 ** 1. Internal Thunk Factory
 ** 2. Action Creators Factory
 **/

import * as _ from "ramda";
import { ModuleInitializationTypeError } from "./crud-error-types";

import { typeCheckOptions, defaultRuntimeErrorHandler } from "./utils";

//////////////////////////////////////////////////////
////// INTERNAL THUNK FACTORY ////////////////////////
//////////////////////////////////////////////////////

const _thunkFactory = _.curry(function(
  actionTypes,
  restApiInstance,
  unexpectedRuntimeErrorHandler,
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
    throw new TypeError(`"${crudMethod}" is not found in the restApi object`);
  }

  return function crudThunk(payload) {
    return function _thunk_(dispatch) {
      try {
        dispatch({ type: actionTypes[actionTypeKey], payload });

        let promise = restApiInstance[crudMethod](payload);
        typeCheckPromise(promise);
        return promise
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
        unexpectedRuntimeErrorHandler(error, {
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

import type { RMLActionCreatorsFacroty } from "./crud-action-creators.flow";

function actionCreatorsFactory(_actionTypes, _restApiInstance, options) {
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

  let thunkFactory = _thunkFactory(
    actionTypes,
    restApiInstance,
    runtimeErrorHandler
  );

  let actionCreators = {
    create: thunkFactory("create"),
    read: thunkFactory("read"),
    update: thunkFactory("update"),
    delete: thunkFactory("delete")
  };

  return Object.assign(actionCreators, options.additional || {});
}

const factory: RMLActionCreatorsFacroty = actionCreatorsFactory;
export default factory;

function typeCheckPromise(promise) {
  if (typeof promise !== "object" || typeof promise.then !== "function") {
    throw new TypeError(
      `Expected a promise, but instead received ${typeof promise} : ${promise}. Check if your rest api function returns a promise.`
    );
  }
}
