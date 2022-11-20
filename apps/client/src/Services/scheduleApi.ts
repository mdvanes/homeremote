import { GetScheduleResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const scheduleApi = createApi({
    reducerPath: "scheduleApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/schedule`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getSchedule: builder.query<GetScheduleResponse, undefined>({
            query: () => "",
        }),
    }),
});

export const { useGetScheduleQuery } = scheduleApi;
