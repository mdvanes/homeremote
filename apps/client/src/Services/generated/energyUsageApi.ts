import { emptySplitApi as api } from "../emptyApi";
export const addTagTypes = ["temperature", "water"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getElectricExports: build.query<
                GetElectricExportsApiResponse,
                GetElectricExportsApiArg
            >({
                query: () => ({ url: `/api/energyusage/electric/exports` }),
            }),
            getTemperatures: build.query<
                GetTemperaturesApiResponse,
                GetTemperaturesApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/energyusage/temperature`,
                    params: { range: queryArg.range },
                }),
                providesTags: ["temperature"],
            }),
            getWater: build.query<GetWaterApiResponse, GetWaterApiArg>({
                query: (queryArg) => ({
                    url: `/api/energyusage/water`,
                    params: { range: queryArg.range },
                }),
                providesTags: ["water"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as energyUsageApi };
export type GetElectricExportsApiResponse =
    /** status 200 ElectricExports */ GetElectricExportsResponse;
export type GetElectricExportsApiArg = void;
export type GetTemperaturesApiResponse =
    /** status 200 Temperatures */ GetTemperaturesResponse;
export type GetTemperaturesApiArg = {
    range?: "day" | "month";
};
export type GetWaterApiResponse = /** status 200 Water */ GetWaterResponse;
export type GetWaterApiArg = {
    range?: "day" | "month";
};
export type GetElectricExportsResponse = {
    export_name?: string;
}[];
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
export type GetWaterResponse = {
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
export const {
    useGetElectricExportsQuery,
    useGetTemperaturesQuery,
    useGetWaterQuery,
} = injectedRtkApi;
