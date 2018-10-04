import * as _ from "ramda";
import * as customErrors from "./crud-error-types";

const thunkFactory = _.curry(function(
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

      if (!restApiInstance[actKey]) {
        throw new TypeError(`"${actKey}" is not found in the restApi object`);
      }
    }
  );

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
      }
    };
  };
});

const addExtendFunctionality = (function() {
  function extend(additionalProperties = {}) {
    if (typeof additionalProperties !== "object") {
      throw new TypeError(
        "Expected and object, but received " + typeof additionalProperties
      );
    }

    return Object.assign(Object.create(this), additionalProperties);
  }

  return function addExtendFunctionality(objectToExtend) {
    return Object.assign(Object.create({ extend }), objectToExtend);
  };
})();

export default function actionCreatorsFactory(actionTypes, restApiInstance) {
  if (!actionTypes) {
    throw new customErrors.ModuleInitializationTypeError(
      "'actionTypes' is required as an argument"
    );
  }

  if (!restApiInstance) {
    throw new customErrors.ModuleInitializationTypeError(
      "'restApiInstance' is required as an argument"
    );
  }

  // let thunkFactory = thunkFactory(actionTypes, restApiInstance);
  //
  // let actionCreators = {
  //   create: thunkFactory("create"),
  //   read: thunkFactory("read"),
  //   update: thunkFactory("update"),
  //   delete: thunkFactory("delete")
  // };
  //
  // return addExtendFunctionality(actionCreators);
}
