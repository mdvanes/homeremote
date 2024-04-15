import { HomesecDevicesResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const homesecApi = createApi({
    reducerPath: "homesecApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/homesec`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getHomesecDeviceList: builder.query<HomesecDevicesResponse, undefined>({
            query: () => "/devices",
        }),
    }),
});

export const { useGetHomesecDeviceListQuery } = homesecApi;
