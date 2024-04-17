import { StacksResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export interface ToggleArgs {
    id: string;
    endpointId: string;
}

export const stacksApi = createApi({
    reducerPath: "stacksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/stacks`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["StackItem"],
    endpoints: (builder) => ({
        getStacks: builder.query<StacksResponse, undefined>({
            query: () => "",
            providesTags: ["StackItem"],
        }),
        startStack: builder.mutation<StacksResponse, ToggleArgs>({
            query: ({ id, endpointId }) => ({
                url: `start/${id}?endpointId=${endpointId}`,
            }),
            invalidatesTags: ["StackItem"],
        }),
        stopStack: builder.mutation<StacksResponse, ToggleArgs>({
            query: ({ id, endpointId }) => ({
                url: `stop/${id}?endpointId=${endpointId}`,
            }),
            invalidatesTags: ["StackItem"],
        }),
    }),
});

export const {
    useGetStacksQuery,
    useStartStackMutation,
    useStopStackMutation,
} = stacksApi;
