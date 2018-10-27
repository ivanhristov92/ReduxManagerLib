import { dispatchAnUnexpectedErrorEvent } from "./crud-error-types";

export default function selectorsFactory(options) {
  let runtimeErrorHandler =
    (options && options.customErrorHandler) || defaultRuntimeErrorHandler;

  function defaultRuntimeErrorHandler(error, { state, action }) {
      dispatchAnUnexpectedErrorEvent(error, { state, action });
  }

  function getAll(state, asArray) {
    try {
      return asArray ? Object.values(state.byId) : state.byId;
    } catch (error) {
      runtimeErrorHandler(error, { state, asArray, selector: "getAll" });
      return asArray ? [] || {};
    }
  }

  function getOne(state, id) {
    try {
        return state.byId[id];
    } catch (error) {
        runtimeErrorHandler(error, { state, id, selector: "getOne" });
        return {}
    }
  }

  function getSome(state, ids = []) {
    try {
        return ids.map(id => state.byId[id]);
    } catch (error) {
        runtimeErrorHandler(error, { state, ids, selector: "getSome" });
        return [];
    }
  }

  return {
    getAll,
    getOne,
    getSome
  };
}


