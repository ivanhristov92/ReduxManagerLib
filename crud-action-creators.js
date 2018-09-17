export default function actionCreatorsFactory(restApiInstance, store) {
  function create() {
    store.dispatch({ type: "A" });
    restApiInstance
      .create()
      .then(response => {
        store.dispatch(createSuccess(response));
      })
      .catch(error => {
        store.dispatch(createFailure(error));
      });
  }
  function createSuccess(response) {}
  function createFailure(error) {}

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
