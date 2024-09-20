import { emptySplitApi as api } from "../emptyApi";
export const addTagTypes = ["temperature", "gas-temperature", "water"] as const;
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
            getGasTemperatures: build.query<
                GetGasTemperaturesApiResponse,
                GetGasTemperaturesApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/energyusage/gas-temperature`,
                    params: { range: queryArg.range },
                }),
                providesTags: ["gas-temperature"],
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
export type GetGasTemperaturesApiResponse =
    /** status 200 GasTemperatures */ GetGasTemperaturesResponse;
export type GetGasTemperaturesApiArg = {
    range?: Range;
};
export type GetWaterApiResponse = /** status 200 Water */ GetWaterResponse;
export type GetWaterApiArg = {
    range?: Range;
};
export type GetElectricExportsResponse = {
    exportName?: string;
    /** for sorting */
    dateMillis?: number;
    date?: string;
    /** store dayOfWeek separately. When this is stored in a datebase it can be queried quickly */
    dayOfWeek?: string;
    /** day usage */
    dayUsage?: number;
    entries?: {
        /** usage low */
        v1?: number;
        /** usage high */
        v2?: number;
        /** usage total */
        v?: number;
        time?: string;
    }[];
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
export type GetGasTemperaturesResponse = {
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
export type Range = "day" | "week" | "month";
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
    useGetGasTemperaturesQuery,
    useGetWaterQuery,
} = injectedRtkApi;
