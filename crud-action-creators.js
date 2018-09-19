export default function actionCreatorsFactory(actionTypes, restApiInstance) {
  if (!actionTypes) {
    throw new Error("'actionTypes' is required as an argument");
  }

  if (!restApiInstance) {
    throw new Error("'restApiInstance' is required as an argument");
  }

  function create() {
    return function _thunk_create(dispatch) {
      dispatch({ type: actionTypes.CREATE });
      return restApiInstance
        .create()
        .then(response => {
          dispatch({
            type: actionTypes.CREATE__SUCCESS
            // payload: response
          });
        })
        .catch(error => {
          dispatch({
            type: actionTypes.CREATE__FAILURE,
            error: error
          });
        });
    };
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
