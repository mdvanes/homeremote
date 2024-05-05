import { emptySplitApi as api } from "../emptyApi";
export const addTagTypes = ["temperature"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getTemperatures: build.query<
                GetTemperaturesApiResponse,
                GetTemperaturesApiArg
            >({
                query: () => ({ url: `/api/energyusage/temperature` }),
                providesTags: ["temperature"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as energyUsageApi };
export type GetTemperaturesApiResponse =
    /** status 200 Temperatures */ GetTemperaturesResponse;
export type GetTemperaturesApiArg = void;
export type GetTemperaturesResponse = {
    entity_id?: string;
    state?: string;
    attributes?: {
        state_class?: string;
        unit_of_measurement?: string;
        device_class?: string;
        friendly_name?: string;
    };
    last_changed?: string;
    last_reported?: string;
    last_updated?: string;
    context?: {
        id?: string;
        parent_id?: string;
        user_id?: string;
    };
}[][];
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
export const { useGetTemperaturesQuery } = injectedRtkApi;
