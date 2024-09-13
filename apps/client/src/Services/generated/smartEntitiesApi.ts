import { emptySplitApi as api } from "../emptyApi";
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
            updateSmartEntity: build.mutation<
                UpdateSmartEntityApiResponse,
                UpdateSmartEntityApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/smart-entities/${queryArg.entityId}`,
                    method: "POST",
                    body: queryArg.updateSmartEntityBody,
                }),
                invalidatesTags: ["smartEntities"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as smartEntitiesApi };
export type GetSmartEntitiesApiResponse =
    /** status 200 getSmartEntities */ GetSmartEntitiesResponse;
export type GetSmartEntitiesApiArg = void;
export type UpdateSmartEntityApiResponse =
    /** status 200 updateSmartEntity */ UpdateSmartEntityResponse;
export type UpdateSmartEntityApiArg = {
    /** Entity ID */
    entityId: string;
    updateSmartEntityBody: UpdateSmartEntityBody;
};
export type Switch = {
    /** Entity ID */
    entity_id?: string;
    /** Current state, On or Off */
    state?: "on" | "off";
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
};
export type GetSmartEntitiesResponse = {
    entities?: Switch[];
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
export type UpdateSmartEntityResponse = string;
export type UpdateSmartEntityBody = {
    /** Target state, On or Off */
    state?: "On" | "Off";
};
export const { useGetSmartEntitiesQuery, useUpdateSmartEntityMutation } =
    injectedRtkApi;
