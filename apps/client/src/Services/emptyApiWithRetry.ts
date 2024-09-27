import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";

export const emptyApiWithRetry = createApi({
    reducerPath: "homeremoteGeneratedApiWithRetry",
    baseQuery: retry(fetchBaseQuery({ baseUrl: "/" })),
    endpoints: () => ({}),
});
