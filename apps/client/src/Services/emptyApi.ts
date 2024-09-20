import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
    reducerPath: "homeremoteGeneratedApi",
    baseQuery: retry(fetchBaseQuery({ baseUrl: "/" })),
    endpoints: () => ({}),
});
