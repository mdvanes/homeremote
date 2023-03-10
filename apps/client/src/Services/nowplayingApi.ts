import { PreviouslyResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const nowplayingApi = createApi({
    reducerPath: "nowplayingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/nowplaying`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Previously"],
    endpoints: (builder) => ({
        getRadio2Previously: builder.query<PreviouslyResponse[], undefined>({
            query: () => "/radio2previously",
            providesTags: ["Previously"],
        }),
    }),
});

export const { useGetRadio2PreviouslyQuery } = nowplayingApi;
