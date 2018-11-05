export type NormalizedData = {
  byId: {
    [id: string | number]: any
  }
};

export type RMLPayloadExpectedByRestClient = any;

type RMLRestMethod =  (
    payload: RMLPayloadExpectedByRestClient
) => Promise<NormalizedData | Error>,

export type RMLRestClientInstance = {
  create: RMLRestMethod,
  read: RMLRestMethod,
  update: RMLRestMethod,
  delete: RMLRestMethod,
  [additionalMethod: string]: RMLRestMethod
};
