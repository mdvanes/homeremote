//import { EnergyUsageGetGasUsageResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export interface FooArgs {
    connectedToken: string;
}

export interface FooResponse {
    result: any;
}

export const carTwinApi = createApi({
    reducerPath: "carTwinApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/cartwin`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getCarTwin: builder.query<FooResponse, FooArgs>({
            query: ({ connectedToken }) => `/?connectedToken=${connectedToken}`,
        }),
    }),
});

export const { useGetCarTwinQuery } = carTwinApi;
