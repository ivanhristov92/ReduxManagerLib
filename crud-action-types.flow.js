// @flow
export type RMLActionTypes = {|
  CREATE: string,
  CREATE__SUCCESS: string,
  CREATE__FAILURE: string,
  READ: string,
  READ__SUCCESS: string,
  READ__FAILURE: string,
  UPDATE: string,
  UPDATE__SUCCESS: string,
  UPDATE__FAILURE: string,
  DELETE: string,
  DELETE__SUCCESS: string,
  DELETE__FAILURE: string,
  [ADDITIONAL_ACTION: string]: string
|};

export type RMLActionTypesOptions = {
  additional?: {
    [SOME_KEY: string]: string
  }
};

export type RMLActionTypesFactory = (
  modelName: string,
  options?: RMLActionTypesOptions
) => RMLActionTypes;
