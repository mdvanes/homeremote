import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Item } from "../Components/Molecules/DataLora/types";
import { willAddCredentials } from "../devUtils";

type GetCoordsResponse = Item[];
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
            transformResponse: (response: { data: Item[] }) => {
                return response?.data ?? [];
            },
        }),
    }),
});

export const { useGetCoordsQuery } = dataloraApi;
