// @flow

import { ModuleInitializationTypeError } from "../crud-error-types";

export function typeCheckOptions(
  options: any,
  settings: any = { additionalContains: "functions" }
) {
  if (!isOptionalObject(options)) {
    throw new ModuleInitializationTypeError(
      `Expected an object or undefined, instead received ${typeof options}: ${options}`
    );
  }

  if (isObject(options) && !isOptionalFunction(options.customErrorHandler)) {
    throw new ModuleInitializationTypeError(
      `Expected an 'customErrorHandler' to be a function, instead received ${typeof options.customErrorHandler}: ${
        options.customErrorHandler
      }`
    );
  }

  if (isObject(options)) {
    if (!isOptionalObject(options.additional)) {
      throw new ModuleInitializationTypeError(
        `Expected 'options.additional' to be an object, instead received ${typeof options.additional}: ${
          options.additional
        }`
      );
    } else {
      Object.values(options.additional || {}).forEach(value => {
        let checkForType =
          settings.additionalContains === "strings" ? "string" : "function";
        if (typeof value !== checkForType) {
          throw new ModuleInitializationTypeError(
            `Expected 'options.additional' to be an object containing functions, instead received  ${typeof value}: ${value}`
          );
        }
      });
    }
  }
}

// helpers
export function isObject(value: any): %checks {
  return typeof value === "object" && !Array.isArray(value) && value;
}

export function isOptionalObject(value: any): %checks {
  return typeof value === "undefined" || isObject(value);
}

export function isOptionalFunction(value: any): %checks {
  return typeof value === "undefined" || typeof value === "function";
}
export function isNonEmptyString(value: any): %checks {
  return typeof value === "string" && value !== "";
}
export function isFunction(value: any): %checks {
  return typeof value === "function";
}
