import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ServiceLinksResponse } from "@homeremote/types";
import { willAddCredentials } from "../devUtils";

export const serviceLinksApi = createApi({
    reducerPath: "serviceLinksApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/servicelinks`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getServiceLinks: builder.query<ServiceLinksResponse, void>({
            query: () => "",
        }),
    }),
});

export const { useGetServiceLinksQuery } = serviceLinksApi;
