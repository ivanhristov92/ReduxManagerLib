// @flow

import { ModuleInitializationTypeError } from "../crud-error-types";
import { isObject, isNonEmptyString, isFunction } from "./type-checks";
import * as _ from "ramda";

import type { BindSelectorsToState } from "./bind-selectors-to-state.flow";

function _bindSelectorsToState(subStateGetter, selectors) {
  if (subStateGetter === null) {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects a string or function as its 0th argument, instead it received ${typeof subStateGetter}: ${subStateGetter +
        ""}`
    );
  }
  if (!isNonEmptyString(subStateGetter) && !isFunction(subStateGetter)) {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects a string or function as its 0th argument, instead it received ${typeof subStateGetter}: ${subStateGetter +
        ""}`
    );
  } else {
    console.log("subStateGetter", subStateGetter);
  }

  if (isNonEmptyString(subStateGetter)) {
    subStateGetter = _.prop(subStateGetter);
  } else if (isFunction(subStateGetter)) {
    subStateGetter = subStateGetter;
  }

  if (!isObject(selectors)) {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects an object as its 0th argument, instead it received ${typeof subStateGetter}: ${subStateGetter +
        ""}`
    );
  }

  const bind = selector => (...args) => {
    let state = subStateGetter(args[0]);
    let rest = args.slice(1) || [];
    let newArgs = [state, ...rest];
    return selector(...newArgs);
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

const bindSelectorsToState: BindSelectorsToState = _bindSelectorsToState;
export { bindSelectorsToState };
