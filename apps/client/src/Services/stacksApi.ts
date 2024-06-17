import { StacksResponse } from "@homeremote/types";
import {
    createApi,
    fetchBaseQuery,
    retry,
} from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export interface ToggleArgs {
    id: string;
    endpointId: string;
}

export const BACKOFF_DELAY = 30_000;

// Exponential backoff. Slower than the default https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-retries.
// E.g. 5 seconds, 10 seconds, 15 seconds, ...maxRetries seconds
const slowerBackOff =
    (delay: number) =>
    async (attempt = 0, maxRetries = 5) => {
        const attempts = Math.min(attempt, maxRetries);

        await new Promise((resolve) => {
            setTimeout(resolve, attempts * delay);
        });
    };

export const stacksApi = createApi({
    reducerPath: "stacksApi",
    baseQuery: retry(
        fetchBaseQuery({
            baseUrl: `${process.env.NX_BASE_URL}/api/stacks`,
            credentials: willAddCredentials(),
        }),
        { maxRetries: 0, backoff: slowerBackOff(BACKOFF_DELAY) }
    ),
    tagTypes: ["StackItem"],
    endpoints: (builder) => ({
        getStacks: builder.query<StacksResponse, undefined>({
            query: () => "",
            providesTags: ["StackItem"],
            extraOptions: { maxRetries: 5 },
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
