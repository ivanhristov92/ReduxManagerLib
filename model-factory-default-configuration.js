import actionTypesFactory from "./crud-action-types";
import actionCreatorsFactory from "./crud-action-creators";
import reducerFactory from "./crud-reducer";
import restApiFactory from "./crud-rest-api";

const DEFAULT_CONFIGURATION = {
  actionTypesFactory,
  actionCreatorsFactory,
  reducerFactory,
  restApiFactory
};

export default DEFAULT_CONFIGURATION;
