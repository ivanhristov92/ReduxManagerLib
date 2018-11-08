// @flow

export type NormalizedData = {
  [id: string | number]: any
};

export type RMLNormalizedDataInWrapper = {
  byId: NormalizedData
};

export type RMLPayloadExpectedByRestClient = any;

type RMLRestMethod = (
  payload: RMLPayloadExpectedByRestClient
) => Promise<RMLNormalizedDataInWrapper | Error>;

export type RMLRestClientInstance = {
  create: RMLRestMethod,
  read: RMLRestMethod,
  update: RMLRestMethod,
  delete: RMLRestMethod,
  [additionalMethod: string]: RMLRestMethod
};
