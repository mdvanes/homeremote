import { emptySplitApi as api } from "../emptyApi";
export const addTagTypes = ["switches"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getSwitches: build.query<GetSwitchesApiResponse, GetSwitchesApiArg>(
                {
                    query: () => ({ url: `/api/switches/ha` }),
                    providesTags: ["switches"],
                }
            ),
            updateHaSwitch: build.mutation<
                UpdateHaSwitchApiResponse,
                UpdateHaSwitchApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/switches/ha/${queryArg.entityId}`,
                    method: "POST",
                    body: queryArg.body,
                }),
                invalidatesTags: ["switches"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as smartEntitiesApi };
export type GetSwitchesApiResponse =
    /** status 200 getSwitches */ GetSwitchesResponse;
export type GetSwitchesApiArg = void;
export type UpdateHaSwitchApiResponse =
    /** status 200 updateHaSwitch */ UpdateHaSwitchResponse;
export type UpdateHaSwitchApiArg = {
    /** Entity ID */
    entityId: string;
    body: {
        /** Target state, On or Off */
        state?: "On" | "Off";
    };
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
export type GetSwitchesResponse = {
    switches?: Switch[];
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
export type UpdateHaSwitchResponse = string;
export const { useGetSwitchesQuery, useUpdateHaSwitchMutation } =
    injectedRtkApi;
