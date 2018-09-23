import * as _ from "ramda";

export default function reducerFactory(actionTypes) {
  const a = actionTypes;
  ["CREATE", "READ", "UPDATE", "DELETE"]
    .reduce((acc, crudAct) => {
      return [...acc, crudAct, crudAct + "__SUCCESS", crudAct + "__FAILURE"];
    }, [])
    .forEach(crudAct => {
      if (!actionTypes[crudAct]) {
        throw new TypeError(`"${crudAct}" is not found in actionTypes`);
      }
    });

  function reducer(
    state = { byId: {}, isFetching: false, error: null },
    action
  ) {
    try {
      if (!action.type) {
        throw new TypeError("'not a valid action'");
      }

      switch (action.type) {
        case a["CREATE"]:
        case a["READ"]:
        case a["UPDATE"]:
        case a["DELETE"]:
          return {
            ...state,
            isFetching: true
          };
        case a["CREATE__SUCCESS"]:
        case a["READ__SUCCESS"]:
        case a["UPDATE__SUCCESS"]:
          return {
            ...state,
            byId: {
              ...state.byId,
              ...action.payload.byId
            },
            isFetching: false
          };
        case a["CREATE__FAILURE"]:
        case a["READ__FAILURE"]:
        case a["UPDATE__FAILURE"]:
        case a["DELETE__FAILURE"]:
          return {
            ...state,
            isFetching: false
          };

        case a["DELETE__SUCCESS"]:
          return {
            ...state,
            byId: _.omit([action.payload.id], state.byId),
            isFetching: false
          };

        default:
          return state;
      }
    } catch (error) {
      return {
        ...state,
        error: error
      };
    }
  }

  reducer.extend = function() {};

  return reducer;
}
