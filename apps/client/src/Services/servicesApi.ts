import { ServicesResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const servicesApi = createApi({
    reducerPath: "servicesApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_PUBLIC_BASE_URL}/api/services`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Service"],
    endpoints: (builder) => ({
        getServices: builder.query<ServicesResponse, undefined>({
            query: () => "",
            providesTags: ["Service"],
        }),
    }),
});

export const { useGetServicesQuery } = servicesApi;
