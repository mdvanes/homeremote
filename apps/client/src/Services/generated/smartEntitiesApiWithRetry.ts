import { emptyApiWithRetry as api } from "../emptyApiWithRetry";
export const addTagTypes = ["smartEntities"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getSmartEntities: build.query<
                GetSmartEntitiesApiResponse,
                GetSmartEntitiesApiArg
            >({
                query: () => ({ url: `/api/smart-entities` }),
                providesTags: ["smartEntities"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as smartEntitiesApiWithRetry };
export type GetSmartEntitiesApiResponse =
    /** status 200 getSmartEntities */ GetSmartEntitiesResponse;
export type GetSmartEntitiesApiArg = void;
export type State = {
    entity_id?: string;
    state?: string;
    attributes?: {
        supported_color_modes?: string[];
        color_mode?: string;
        brightness?: string;
        entity_id?: string[];
        icon?: string;
        friendly_name?: string;
        supported_features?: number;
        /** Undefined for switches. Can also be e.g. `temperature`. */
        device_class?: string;
        state_class?: string;
        unit_of_measurement?: string;
    };
    last_changed?: string;
    last_reported?: string;
    last_updated?: string;
    context?: {
        id?: string;
        parent_id?: string;
        user_id?: string;
    };
};
export type GetSmartEntitiesResponse = {
    entities?: State[];
};
export type ErrorResponse = {
    /** Time when error happened */
    timestamp?: string;
    /** Code describing the error */
    status?: number;
    /** Short error name */
    error?: string;
    /** Message explaining the error */
    message?: string;
    /** Code of the error */
    code?: number;
};
export const { useGetSmartEntitiesQuery } = injectedRtkApi;
