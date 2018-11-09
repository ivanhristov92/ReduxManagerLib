// @flow
export type NormalizedData<T> = {
    [id: string | number]: T
};

export type RMLNormalizedDataInWrapper<T> = {
    byId: NormalizedData<T>
};

export type RMLPayloadExpectedByRestClient = any;

/**
 * General Types
 */
export type RMLRestClient = {
    create: (
        payload: RMLPayloadExpectedByRestClient
    ) => Promise<RMLNormalizedDataInWrapper<any> | Error>,
    read: (
        payload: RMLPayloadExpectedByRestClient
    ) => Promise<RMLNormalizedDataInWrapper<any> | Error>,
    update: (
        payload: RMLPayloadExpectedByRestClient
    ) => Promise<RMLNormalizedDataInWrapper<any> | Error>,
    delete: (
        payload: RMLPayloadExpectedByRestClient
    ) => Promise<{ ids: Array<string | number> } | { id: string | number } | Error>,
    [additionalMethod: string]: (payload: any) => Promise<any | Error>
};


/**
 * Instance Types
 */
export type RMLCreate<ExpectsPayload, EntryShape, ErrorShape> = (
    payload: ExpectsPayload
) => Promise<RMLNormalizedDataInWrapper<EntryShape> | ErrorShape>;

export type RMLRead<ExpectsPayload, EntryShape, ErrorShape> = (
    payload: ExpectsPayload
) => Promise<RMLNormalizedDataInWrapper<EntryShape> | ErrorShape>

export type RMLUpdate <ExpectsPayload, EntryShape, ErrorShape> = (
    payload: ExpectsPayload
) => Promise<RMLNormalizedDataInWrapper<EntryShape> | ErrorShape>

export type RMLDelete<ExpectsPayload, IdType, ErrorShape> = (
    payload: ExpectsPayload
) => Promise<{ ids: Array<IdType> } | { id: IdType } | ErrorShape>

export type RMLAdditionalMethod<ExpectsPayload, ReturnsShape, ErrorShape> = (
    payload: ExpectsPayload
) => Promise<ReturnsShape | ErrorShape>
