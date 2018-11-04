// @flow
import * as _ from "ramda";
import { ModuleInitializationTypeError } from "./crud-error-types";
import { typeCheckOptions } from "./utils";

import type { RMLActionTypesFactory } from "./crud-action-types.flow";

function actionTypesFactory(modelName, options) {
  if (typeof modelName !== "string" || modelName === "") {
    throw new ModuleInitializationTypeError(
      `'modelName' is required to be a non-empty string, instead got ${typeof modelName} : ${modelName}`
    );
  }

  typeCheckOptions(options, { additionalContains: "strings" });
  options = options || {};

  const addModelName = _.map(actionTypeValue => {
    return `${modelName}/${actionTypeValue}`;
  });

  let actionTypes = addModelName({
    CREATE: "CREATE",
    CREATE__SUCCESS: "CREATE__SUCCESS",
    CREATE__FAILURE: "CREATE__FAILURE",
    READ: "READ",
    READ__SUCCESS: "READ__SUCCESS",
    READ__FAILURE: "READ__FAILURE",
    UPDATE: "UPDATE",
    UPDATE__SUCCESS: "UPDATE__SUCCESS",
    UPDATE__FAILURE: "UPDATE__FAILURE",
    DELETE: "DELETE",
    DELETE__SUCCESS: "DELETE__SUCCESS",
    DELETE__FAILURE: "DELETE__FAILURE"
  });

  let extendedActionTypes = Object.assign(
    actionTypes,
    options.additional || {}
  );

  return extendedActionTypes;
}

const module: RMLActionTypesFactory = actionTypesFactory;
export default module;
