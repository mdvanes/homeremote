import { GetNextUpResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const nextupApi = createApi({
    reducerPath: "nextupApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/nextup`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getNextup: builder.query<GetNextUpResponse, undefined>({
            query: () => "",
        }),
    }),
});

export const { useGetNextupQuery } = nextupApi;
