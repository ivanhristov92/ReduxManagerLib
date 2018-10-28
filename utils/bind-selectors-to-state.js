import { ModuleInitializationTypeError } from "../crud-error-types";
import * as _ from "ramda";

export function bindSelectorsToState(subStateGetter, selectors) {
  if (
    (typeof subStateGetter !== "string" &&
      typeof subStateGetter !== "function") ||
    subStateGetter === ""
  ) {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects a string or function as its 0th argument, intead it received ${typeof subStateGetter}: ${subStateGetter}`
    );
  }

  if (typeof subStateGetter === "string") {
    subStateGetter = _.prop(subStateGetter);
  }

  const bind = sel => (...args) => {
    let state = subStateGetter(args[0]);
    let rest = args.slice(1) || [];
    let newArgs = [state, ...rest];
    return sel(...newArgs);
  };
  const bindRecursively = _.map(selector => {
    let type = typeof selector;

    if (type === "undefined") {
      throw new TypeError("Selector is of type 'undefined'");
    }

    if (type === "function") {
      return bind(selector);
    }

    if (type === "object") {
      return bindRecursively(selector);
    }
  });

  return bindRecursively(selectors);
}
