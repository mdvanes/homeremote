import { HomesecStatusResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const homesecApi = createApi({
    reducerPath: "homesecApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/homesec`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getHomesecStatus: builder.query<HomesecStatusResponse, undefined>({
            query: () => "/status",
        }),
    }),
});

export const { useGetHomesecStatusQuery } = homesecApi;
