import * as _ from "ramda";

export default function reducerFactory(actionTypes) {
  const a = actionTypes;
  return function reducer(state = { byId: {}, isFetching: false }, action) {
    switch (action) {
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
  };
}
