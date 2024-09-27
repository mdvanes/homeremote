import {
    UrlToMusicGetInfoArgs,
    UrlToMusicGetInfoResponse,
    UrlToMusicGetMusicArgs,
    UrlToMusicGetMusicProgressResponse,
    UrlToMusicGetMusicResponse,
    UrlToMusicGetSearchArgs,
    UrlToMusicGetSearchResponse,
} from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const urlToMusicApi = createApi({
    reducerPath: "urlToMusicApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/urltomusic`,
        credentials: willAddCredentials(),
    }),
    endpoints: (builder) => ({
        getSearch: builder.query<
            UrlToMusicGetSearchResponse,
            UrlToMusicGetSearchArgs
        >({
            query: ({ terms }) => `/getsearch/${terms}`,
        }),
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

export const {
    useGetInfoQuery,
    useGetMusicQuery,
    useGetMusicProgressQuery,
    useGetSearchQuery,
} = urlToMusicApi;
