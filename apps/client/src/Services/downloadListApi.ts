import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { DownloadItem } from "@homeremote/types";
import { willAddCredentials } from "../devUtils";

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
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/downloadlist`,
        credentials: willAddCredentials(),
    }),
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
