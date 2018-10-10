import * as _ from "ramda";
import * as customErrors from "./crud-error-types";
import {
  UnexpectedRuntimeError,
  dispatchAnUnexpectedErrorEvent
} from "./crud-error-types";

import { addExtendFunctionality } from "./utils";

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
        dispatchAnUnexpectedErrorEvent(error);
      }
    };
  };
});

export default function actionCreatorsFactory(_actionTypes, _restApiInstance) {
  if (!_actionTypes) {
    throw new customErrors.ModuleInitializationTypeError(
      "'actionTypes' is required as an argument"
    );
  }

  if (!_restApiInstance) {
    throw new customErrors.ModuleInitializationTypeError(
      "'restApiInstance' is required as an argument"
    );
  }

  let actionTypes = _.clone(_actionTypes);
  let restApiInstance = _.clone(_restApiInstance);

  let thunkFactory = _thunkFactory(actionTypes, restApiInstance);

  let actionCreators = {
    create: thunkFactory("create"),
    read: thunkFactory("read"),
    update: thunkFactory("update"),
    delete: thunkFactory("delete")
  };
  return addExtendFunctionality(actionCreators);
}
