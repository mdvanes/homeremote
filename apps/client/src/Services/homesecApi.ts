import { HomesecStatusResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const homesecApi = createApi({
    reducerPath: "homesecApi",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: `${process.env.NX_BASE_URL}/api/homesec`,
            credentials: willAddCredentials(),
        })
    ),
    endpoints: (builder) => ({
        getHomesecStatus: builder.query<HomesecStatusResponse, undefined>({
            query: () => "/status",
        }),
    }),
});

export const { useGetHomesecStatusQuery } = homesecApi;
