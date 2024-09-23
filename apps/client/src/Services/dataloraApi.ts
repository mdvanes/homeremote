import { TrackerItem } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

type GetCoordsResponse = TrackerItem[];
type GetCoordsArgs = {
    type: string;
};

export const dataloraApi = createApi({
    reducerPath: "dataloraApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/datalora`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getCoords: builder.query<GetCoordsResponse, GetCoordsArgs>({
            query: (queryParams) => `?type=${queryParams.type}`,
            transformResponse: (response: { data: TrackerItem[] }) => {
                return response?.data ?? [];
            },
        }),
    }),
});

export const { useGetCoordsQuery } = dataloraApi;
