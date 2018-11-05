// @flow

import type { RMLState, RMLOperationStates } from "./crud-reducer.flow";

export type RMLSelectorsFactoryOptions = {
  additional?: {
    [additionalSelector: string]: (Function) => any
  },
  customErrorHandler?: (error: Error, details?: Object) => void
};

export type RMLSelectors = {
  getAll: (state: RMLState, format: "map" | "list") => Array | Object,
  getOne: (state: RMLState, id: string | number) => any | Object,
  getSome: (
    state: RMLState,
    ids: [string | number],
    format: "map" | "list"
  ) => Array | Object,
  getError: (state: RMLState) => ?Object,
  getOperationStates: (state: RMLState) => RMLOperationStates,
  [additionalSelector: string]: (Function) => any
};

export type RMLSelectorsFactory = (
  options?: RMLSelectorsFactoryOptions
) => RMLSelectors;
