import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DownloadItem } from "../ApiTypes/downloadlist.types";

interface ToggleArgs {
    id: number;
}
interface ToggleResponse {
    message: string;
    status: string;
}

type DownloadListResponse =
    | { status: "received"; downloads: DownloadItem[] }
    | { status: "error" };

export const downloadListApi = createApi({
    reducerPath: "downloadListApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/downloadlist" }),
    tagTypes: ["DownloadItem"],
    endpoints: (builder) => ({
        getDownloadList: builder.query<DownloadListResponse, void>({
            query: () => "",
            // Tags are used to trigger getDownloadList after toggleDownload
            providesTags: ["DownloadItem"],
        }),
        resumeDownload: builder.mutation<ToggleResponse, ToggleArgs>({
            query: (body) => ({
                url: `resumeDownload/${body.id}`,
            }),
            invalidatesTags: ["DownloadItem"],
        }),
        pauseDownload: builder.mutation<ToggleResponse, ToggleArgs>({
            query: (body) => ({
                url: `pauseDownload/${body.id}`,
            }),
            invalidatesTags: ["DownloadItem"],
        }),
    }),
});

export const {
    useGetDownloadListQuery,
    useResumeDownloadMutation,
    usePauseDownloadMutation,
} = downloadListApi;
