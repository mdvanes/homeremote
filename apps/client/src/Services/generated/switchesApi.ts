import { emptySplitApi as api } from "../emptyApi";
export const addTagTypes = [] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            updateHaSwitch: build.mutation<
                UpdateHaSwitchApiResponse,
                UpdateHaSwitchApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/switches/ha/${queryArg.entityId}`,
                    method: "POST",
                    body: queryArg.body,
                }),
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as switchesApi };
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
export type UpdateHaSwitchResponse = string;
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
export const { useUpdateHaSwitchMutation } = injectedRtkApi;
