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
        case (function() {
          return a["CREATE"];
        })():
        case a["READ"]:
        case a["UPDATE"]:
        case a["DELETE"]:
          return {
            ...state,
            isFetching: true,
            error: null
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
            isFetching: false,
            error: null
          };
        case a["CREATE__FAILURE"]:
        case a["READ__FAILURE"]:
        case a["UPDATE__FAILURE"]:
        case a["DELETE__FAILURE"]: {
          if (!action.error) {
            throw new TypeError(
              "failure action needs to have an 'error' attribute"
            );
          }
          return {
            ...state,
            isFetching: false,
            error: action.error
          };
        }

        case a["DELETE__SUCCESS"]:
          return {
            ...state,
            byId: _.omit([action.payload.id], state.byId),
            isFetching: false,
            error: null
          };

        default:
          return state;
      }
    } catch (error) {
      // unexpeted run-time error
      try {
        return {
          ...state,
          error: error
        };
      } catch (err) {
        //emit global error
      }
    }
  }

  reducer.extend = function() {};

  return reducer;
}
