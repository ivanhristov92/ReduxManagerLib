export default function selectorsFactory(model) {
  function getAll(state, options = {}) {
    return options.array ? Object.values(state.byId) : state.byId;
  }

  function getOne(state, id) {
    return state.byId[id];
  }

  function getSome(state, ids = []) {
    return ids.map(id => state.byId[id]);
  }

  return {
    getAll,
    getOne,
    getSome
  };
}
