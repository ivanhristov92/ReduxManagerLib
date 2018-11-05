// @flow

import { RMLActionTypes } from "./crud-action-types.flow";
import { RMLAction } from "./crud-action-creators.flow";
import { NormalizedData } from "./crud-rest-api.flow";

export type OperationState = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

export type RMLState = {
  byId: NormalizedData,
  error: ?Error,
  create: OperationState,
  read: OperationState,
  update: OperationState,
  delete: OperationState,
  [additionalState: string]: any
};

export type RMLReducer = (state: RMLState, action: RMLAction) => RMLState;

export type RMLReducerFactoryOptions = {
  additional?: {
    [SOME_ACTION: string]: RMLReducer
  },
  customErrorHandler?: (error: Error, details?: Object) => void
};

export type RMLReducerFactory = (
  actionTypes: RMLActionTypes,
  options: RMLReducerFactoryOptions
) => RMLReducer;
