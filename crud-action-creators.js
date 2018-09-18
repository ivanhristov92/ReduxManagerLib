export default function actionCreatorsFactory(
  actionTypes,
  restApiInstance,
  store
) {
  if (!actionTypes) {
    throw new Error("'actionTypes' is required as an argument");
  }

  if (!restApiInstance) {
    throw new Error("'restApiInstance' is required as an argument");
  }
  if (!store) {
    throw new Error("'store' is required as an argument");
  }
  function create() {
    store.dispatch({ type: actionTypes.CREATE });
    restApiInstance
      .create()
      .then(response => {
        store.dispatch({
          type: actionTypes.CREATE_SUCCESS,
          payload: response
        });
      })
      .catch(error => {
        store.dispatch({
          type: actionTypes.CREATE_FAILURE,
          error: error
        });
      });
  }

  function read() {
    return {
      type: "A"
    };
  }
  function update() {
    return {
      type: "A"
    };
  }
  function _delete() {
    return {
      type: "A"
    };
  }

  return {
    create,
    read,
    update,
    delete: _delete
  };
}
