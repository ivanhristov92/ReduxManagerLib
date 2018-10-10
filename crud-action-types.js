import * as _ from "ramda";
import { ModuleInitializationTypeError } from "./crud-error-types";

export default function actionTypesFactory(modelName) {
  if (typeof modelName !== "string" || modelName === "") {
    throw new ModuleInitializationTypeError(
      `'modelName' is required to be a non-empty string, instead got ${typeof modelName} : ${modelName}`
    );
  }

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
  function createExtendableActionTypes() {
    const extendFunctionalityProto = {
      extend: function extendActionTypes(additionalActionTypes) {
        if (!additionalActionTypes) {
          throw new TypeError(
            "Expected and object, but received " + typeof additionalActionTypes
          );
        }

        if (typeof additionalActionTypes !== "object") {
          throw new TypeError(
            "Expected and object, but received " + typeof additionalActionTypes
          );
        }

        if (Array.isArray(additionalActionTypes)) {
          throw new TypeError(
            "Expected and object, but received " + typeof additionalActionTypes
          );
        }
        let extendableActionTypes = createExtendableActionTypes();
        return Object.assign(extendableActionTypes, additionalActionTypes);
      }
    };

    return Object.assign(Object.create(extendFunctionalityProto), actionTypes);
  }

  return createExtendableActionTypes();
}
