import { CarTwinArgs, CarTwinResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const carTwinApi = createApi({
    reducerPath: "carTwinApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/cartwin`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        // NOTE: must be mutation/POST, when sending token from the front-end, because it's too long for the URL
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
