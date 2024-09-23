import {
    AddSongArg,
    AddSongResponse,
    PlaylistArgs,
    PlaylistResponse,
    PlaylistsResponse,
    SongDirResponse,
} from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { willAddCredentials } from "../devUtils";

export const jukeboxApi = createApi({
    reducerPath: "jukeboxApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/jukebox`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Playlists", "Songs", "Songdir", "Starred"],
    endpoints: (builder) => ({
        getPlaylists: builder.query<PlaylistsResponse, undefined>({
            query: () => "/playlists",
            providesTags: ["Playlists"],
        }),
        getPlaylist: builder.query<PlaylistResponse, PlaylistArgs>({
            query: ({ id, type }) => `/playlist/${id}?type=${type}`,
            providesTags: ["Songs"],
        }),
        getSongDir: builder.query<SongDirResponse, undefined>({
            query: () => "/songdir",
            providesTags: ["Songdir"],
        }),
        addSongToPlaylist: builder.mutation<AddSongResponse, AddSongArg>({
            query: ({ playlistId, songId }) => {
                return {
                    url: "/addsongtoplaylist",
                    method: "POST",
                    body: { playlistId, songId },
                };
            },
            invalidatesTags: ["Songs"],
        }),
    }),
});

export const {
    useGetPlaylistsQuery,
    useGetPlaylistQuery,
    useGetSongDirQuery,
    useAddSongToPlaylistMutation,
} = jukeboxApi;
