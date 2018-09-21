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

    return function crudThunk(payload) {
      return function _thunk_(dispatch) {
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
      };
    };
  }

  let actionCreators = {
    create: thunkFactory("create"),
    read: thunkFactory("read"),
    update: thunkFactory("update"),
    delete: thunkFactory("delete")
  };

  function createExtendableActionCreators() {
    const extendFunctionalityProto = {
      extend(additionalActionCreators = {}) {
        if (typeof additionalActionCreators !== "object") {
          throw new TypeError(
            "Expected and object, but received " +
              typeof additionalActionCreators
          );
        }

        let extendableActionCreators = createExtendableActionCreators();
        return Object.assign(
          extendableActionCreators,
          additionalActionCreators
        );
      }
    };

    return Object.assign(
      Object.create(extendFunctionalityProto),
      actionCreators
    );
  }

  return createExtendableActionCreators();
}
