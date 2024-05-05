import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const emptySplitApi = createApi({
    reducerPath: "energy-usage-api",
    baseQuery: fetchBaseQuery(),
    // baseQuery: (args, api, extraOptions) => {
    //   const baseUrl = FETCH_INTERCEPT_ROOT_URL;
    //   return fetchBaseQuery({
    //     baseUrl,
    //   })(args, api, extraOptions);
    // },
    endpoints: () => ({}),
});
