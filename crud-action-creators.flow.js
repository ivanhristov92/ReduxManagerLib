// @flow

import type { RMLActionTypes } from "./crud-action-types.flow";
import type {
  RMLRestClient,
  RMLPayloadExpectedByRestClient
} from "./crud-rest-api.flow";

export type RMLAction = {
  type: string,
  payload?: any,
  error?: ?Error
};

export type RMLActionCreator = (
  payload: RMLPayloadExpectedByRestClient
) => RMLAction | void;

export type RMLActionCreators = {
  create: RMLActionCreator,
  read: RMLActionCreator,
  update: RMLActionCreator,
  delete: RMLActionCreator,
  [someActionCreator: string]: RMLActionCreator
};

export type RMLActionCreatorsOptions = {
  additional?: {
    [someActionCreator: string]: RMLActionCreator
  },
  customErrorHandler?: (error: Error, details?: Object) => void
};

export type RMLActionCreatorsFacroty = (
  actionTypes: RMLActionTypes,
  restClientInstance: RMLRestClient,
  options?: RMLActionCreatorsOptions
) => RMLActionCreators;
