import { emptyApiWithRetry as api } from "../emptyApiWithRetry";
export const addTagTypes = ["speedtest"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getSpeedtest: build.query<
                GetSpeedtestApiResponse,
                GetSpeedtestApiArg
            >({
                query: () => ({ url: `/api/speedtest/latest` }),
                providesTags: ["speedtest"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as speedTestApiWithRetry };
export type GetSpeedtestApiResponse =
    /** status 200 getSpeedtest */ GetSpeedtestResponse;
export type GetSpeedtestApiArg = void;
export type SpeedTestResult = {
    id?: string;
    download?: number;
    upload?: number;
    ping?: number;
    server_id?: number;
    server_host?: string;
    server_name?: string;
    url?: string;
    scheduled?: boolean;
    failed?: boolean;
    created_at?: string;
    updated_at?: string;
};
export type GetSpeedtestResponse = {
    message?: string;
    data?: SpeedTestResult;
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
export const { useGetSpeedtestQuery } = injectedRtkApi;
