import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emptyApi = createApi({
    reducerPath: "homeremoteGeneratedApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: () => ({}),
});
