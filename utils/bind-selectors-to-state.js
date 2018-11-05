// @flow

import { ModuleInitializationTypeError } from "../crud-error-types";
import { isObject, isNonEmptyString, isFunction } from "./type-checks";
import * as _ from "ramda";

import type { BindSelectorsToState } from "./bind-selectors-to-state.flow";

function _bindSelectorsToState(_subStateGetter, selectors) {
  let subStateGetter: Function;
  if (isNonEmptyString(_subStateGetter)) {
    subStateGetter = (_.prop(_subStateGetter): Function);
  } else if (isFunction(_subStateGetter)) {
    subStateGetter = _subStateGetter;
  } else {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects a string or function as its 0th argument, intead it received ${typeof _subStateGetter}: ${_subStateGetter.toString()}`
    );
  }

  if (!isObject(selectors)) {
    throw new ModuleInitializationTypeError(
      `bindSelectorsToState expects an object as its 0th argument, intead it received ${typeof subStateGetter}: ${subStateGetter.toString()}`
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
