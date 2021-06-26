import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DownloadItem } from "../ApiTypes/downloadlist.types";

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

export const downloadListApi = createApi({
    reducerPath: "downloadListApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/downloadlist" }),
    endpoints: (builder) => ({
        getDownloadList: builder.query<DownloadListResponse, void>({
            query: () => "",
        }),
    }),
});

export const { useGetDownloadListQuery } = downloadListApi;
