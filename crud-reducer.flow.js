// @flow

import type { RMLActionTypes } from "./crud-action-types.flow";
import type { RMLAction } from "./crud-action-creators.flow";
import type { NormalizedData } from "./crud-rest-api.flow";

export type RMLOperationState = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

export type RMLOperationStates = {
  create: RMLOperationState,
  read: RMLOperationState,
  update: RMLOperationState,
  delete: RMLOperationState
};

export type RMLState = {
  byId: NormalizedData,
  error: ?Error
} & RMLOperationStates & { [additionalState: string]: any };

export type RMLReducer = (state: RMLState, action: RMLAction) => RMLState;

export type RMLReducerFactoryOptions = {
  additional?: {
    [SOME_ACTION: string]: RMLReducer
  },
  customErrorHandler?: (error: Error, details?: Object) => RMLState
};

export type RMLReducerFactory = (
  actionTypes: RMLActionTypes,
  options: RMLReducerFactoryOptions
) => RMLReducer;
