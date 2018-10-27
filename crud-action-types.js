import * as _ from "ramda";
import { ModuleInitializationTypeError } from "./crud-error-types";
import { typeCheckExtensions } from "./utils";

export default function actionTypesFactory(modelName, additionalActionTypes) {
  if (typeof modelName !== "string" || modelName === "") {
    throw new ModuleInitializationTypeError(
      `'modelName' is required to be a non-empty string, instead got ${typeof modelName} : ${modelName}`
    );
  }

  typeCheckExtensions(additionalActionTypes);

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

  let extendedActionTypes = Object.assign(actionTypes, additionalActionTypes);
  return extendedActionTypes;
}
