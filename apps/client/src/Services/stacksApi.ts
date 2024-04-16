import { StacksResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const stacksApi = createApi({
    reducerPath: "stacksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/stacks`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getStacks: builder.query<StacksResponse, undefined>({
            query: () => "",
        }),
    }),
});

export const { useGetStacksQuery } = stacksApi;
