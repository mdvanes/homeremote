import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
    // reducerPath: "energy-usage-api",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: () => ({}),
});
