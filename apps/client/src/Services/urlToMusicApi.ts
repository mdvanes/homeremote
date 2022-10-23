import {
    UrlToMusicGetInfoArgs,
    UrlToMusicGetInfoResponse,
    UrlToMusicGetMusicArgs,
    UrlToMusicGetMusicProgressResponse,
    UrlToMusicGetMusicResponse,
} from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const urlToMusicApi = createApi({
    reducerPath: "urlToMusicApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/urltomusic`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getInfo: builder.query<
            UrlToMusicGetInfoResponse,
            UrlToMusicGetInfoArgs
        >({
            query: ({ url }) => `/getinfo/${url}`,
        }),
        getMusic: builder.query<
            UrlToMusicGetMusicResponse,
            UrlToMusicGetMusicArgs
        >({
            query: ({ url, artist, title, album }) =>
                `/getmusic/${url}?artist=${artist}&title=${title}&album=${album}`,
        }),
        getMusicProgress: builder.query<
            UrlToMusicGetMusicProgressResponse,
            UrlToMusicGetInfoArgs
        >({
            query: ({ url }) => `/getmusic/${url}/progress`,
        }),
    }),
});

export const { useGetInfoQuery, useGetMusicQuery, useGetMusicProgressQuery } =
    urlToMusicApi;
