import { GetMonitResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const monitApi = createApi({
    reducerPath: "monitApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/monit`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getMonitStatus: builder.query<GetMonitResponse, undefined>({
            query: () => "",
        }),
    }),
});

export const { useGetMonitStatusQuery } = monitApi;
