import { CarTwinArgs, CarTwinResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

// TODO generate this type with OpenAPI v3
// export interface FooResponse {
//     energy: {
//         data: {
//             batteryChargeLevel: {
//                 value: string;
//                 unit: string;
//                 timestamp: string;
//             };
//             electricRange: {
//                 value: string;
//                 unit: string;
//                 timestamp: string;
//             };
//             estimatedChargingTime: {
//                 value: string;
//                 unit: string;
//                 timestamp: string;
//             };
//             chargingConnectionStatus: {
//                 value: string;
//                 timestamp: string;
//             };
//             chargingSystemStatus: {
//                 value: string;
//                 timestamp: string;
//             };
//         };
//     };
// }

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
        getCarTwin: builder.mutation<CarTwinResponse, CarTwinArgs>({
            query: ({ connectedToken, energyToken }) => ({
                url: "/",
                method: "POST",
                body: {
                    connectedToken,
                    energyToken,
                },
            }),
        }),
    }),
});

export const { useGetCarTwinMutation } = carTwinApi;
