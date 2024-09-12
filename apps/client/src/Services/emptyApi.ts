import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
    reducerPath: "homeremoteGeneratedApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: () => ({}),
});
