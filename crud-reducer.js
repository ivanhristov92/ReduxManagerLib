import * as _ from "ramda";

export default function reducerFactory() {
  return function reducer(state = { byId: {}, isFetching: false }, action) {
    switch (action) {
      case "CREATE":
      case "READ":
      case "UPDATE":
      case "DELETE":
        return {
          ...state,
          isFetching: true
        };
      case "CREATE__SUCCESS":
      case "READ__SUCCESS":
      case "UPDATE__SUCCESS":
        return {
          ...state,
          byId: {
            ...state.byId,
            ...action.payload.byId
          },
          isFetching: false
        };
      case "CREATE__FAILURE":
      case "READ__FAILURE":
      case "UPDATE__FAILURE":
      case "DELETE__FAILURE":
        return {
          ...state,
          isFetching: false
        };

      case "DELETE__SUCCESS":
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
