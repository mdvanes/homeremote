import { PlaylistsResponse } from "@homeremote/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

export const jukeboxApi = createApi({
    reducerPath: "jukeboxApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/jukebox`,
        credentials: willAddCredentials(),
    }),
    // tagTypes: ["Jukebox"],
    endpoints: (builder) => ({
        getPlaylists: builder.query<PlaylistsResponse, undefined>({
            query: () => "",
            // providesTags: ["Jukebox"],
        }),
    }),
});

export const { useGetPlaylistsQuery } = jukeboxApi;
