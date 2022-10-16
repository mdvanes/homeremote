import {
    PlaylistArgs,
    PlaylistResponse,
    PlaylistsResponse,
} from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const jukeboxApi = createApi({
    reducerPath: "jukeboxApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/jukebox`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Playlists", "Songs"],
    endpoints: (builder) => ({
        getPlaylists: builder.query<PlaylistsResponse, undefined>({
            query: () => "/playlists",
            providesTags: ["Playlists"],
        }),
        getPlaylist: builder.query<PlaylistResponse, PlaylistArgs>({
            query: ({ id }) => `/playlist/${id}`,
            providesTags: ["Songs"],
        }),
    }),
});

export const { useGetPlaylistsQuery, useGetPlaylistQuery } = jukeboxApi;
