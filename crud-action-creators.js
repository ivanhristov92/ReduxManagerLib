export default function actionCreatorsFactory(actionTypes, restApiInstance) {
  if (!actionTypes) {
    throw new Error("'actionTypes' is required as an argument");
  }

  if (!restApiInstance) {
    throw new Error("'restApiInstance' is required as an argument");
  }

  function thunkFactory(crudMethod) {
    let actionTypeKey = crudMethod.toUpperCase();
    let actionTypeSuccessKey = actionTypeKey + "__SUCCESS";
    let actionTypeFailureKey = actionTypeKey + "__FAILURE";

    return function crudThunk() {
      return function _thunk_(dispatch) {
        dispatch({ type: actionTypes[actionTypeKey] });
        return restApiInstance
          .create()
          .then(response => {
            dispatch({
              type: actionTypes[actionTypeSuccessKey]
              // payload: response
            });
          })
          .catch(error => {
            dispatch({
              type: actionTypes[actionTypeFailureKey],
              error: error
            });
          });
      };
    };
  }

  return {
    create: thunkFactory("create"),
    read: thunkFactory("read"),
    update: thunkFactory("update"),
    delete: thunkFactory("delete")
  };
}
