import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { willAddCredentials } from "../devUtils";

interface NowPlayingResponse {
    artist: string;
    title: string;
    last_updated: string;
    songImageUrl: string;
    name: string;
    imageUrl: string;
}

export type ISOTimeString = string;
export interface RadioMetadata {
    time?: {
        start?: ISOTimeString;
        end?: ISOTimeString;
    };
    broadcast?: {
        title?: string;
        presenters?: string;
        imageUrl?: string;
    };
    song: {
        artist?: string;
        title?: string;
        imageUrl?: string;
        listenUrl?: string;
    };
}

interface PreviouslyResponse extends NowPlayingResponse {
    broadcast: RadioMetadata["broadcast"];
    time: RadioMetadata["time"];
    listenUrl: RadioMetadata["song"]["listenUrl"];
}

export const nowplayingApi = createApi({
    reducerPath: "nowplayingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NX_BASE_URL}/api/nowplaying`,
        credentials: willAddCredentials(),
    }),
    tagTypes: ["Previously"],
    endpoints: (builder) => ({
        getRadio2Previously: builder.query<PreviouslyResponse[], undefined>({
            query: () => "/radio2previously",
            providesTags: ["Previously"],
        }),
    }),
});

export const { useGetRadio2PreviouslyQuery } = nowplayingApi;
