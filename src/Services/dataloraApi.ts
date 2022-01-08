import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { Item } from "../Components/Molecules/DataLora/types";

type GetCoordsResponse = Item[];
type GetCoordsArgs = {
    type: string;
};

export const dataloraApi = createApi({
    reducerPath: "dataloraApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/datalora" }),
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
