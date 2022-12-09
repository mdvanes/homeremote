//import { EnergyUsageGetGasUsageResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export interface FooArgs {
    connectedToken: string;
}

// TODO generate this type with OpenAPI v3
export interface FooResponse {
    result: {
        data: {
            odometer: {
                value: string;
                unit: string;
                timestamp: string;
            };
        };
    };
    doors: {
        data: {
            carLocked: {
                value: string;
                timestamp: string;
            };
            frontLeft: {
                value: string;
                timestamp: string;
            };
            frontRight: {
                value: string;
                timestamp: string;
            };
            hood: {
                value: string;
                timestamp: string;
            };
            rearLeft: {
                value: string;
                timestamp: string;
            };
            rearRight: {
                value: string;
                timestamp: string;
            };
            tailGate: {
                value: string;
                timestamp: string;
            };
        };
    };
    car: {
        data: {
            images: {
                exteriorDefaultUrl: string;
            };
        };
    };
}

export const carTwinApi = createApi({
    reducerPath: "carTwinApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/cartwin`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        // TODO must be mutation/POST, when sending token from the front-end, because it's too long for the URL
        // getCarTwin: builder.query<FooResponse, FooArgs>({
        //     query: ({ connectedToken }) => `/?connectedToken=${connectedToken}`,
        // }),
        getCarTwin: builder.mutation<FooResponse, FooArgs>({
            query: ({ connectedToken }) => ({
                url: "/",
                method: "POST",
                body: {
                    connectedToken,
                },
            }),
        }),
    }),
});

export const {
    // useGetCarTwinQuery
    useGetCarTwinMutation,
} = carTwinApi;
