import { EnergyUsageGetGasUsageResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const energyUsageApi = createApi({
    reducerPath: "energyUsageApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/energyusage`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getGasUsage: builder.query<EnergyUsageGetGasUsageResponse, undefined>({
            query: () => "/gas",
        }),
    }),
});

export const { useGetGasUsageQuery } = energyUsageApi;
