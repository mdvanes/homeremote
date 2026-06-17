import { emptyApi as api } from "../emptyApi";
export const addTagTypes = ["nowplaying"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getRadio2: build.query<GetRadio2ApiResponse, GetRadio2ApiArg>({
                query: () => ({ url: `/api/nowplaying/radio2` }),
                providesTags: ["nowplaying"],
            }),
            getRadio2Previously: build.query<
                GetRadio2PreviouslyApiResponse,
                GetRadio2PreviouslyApiArg
            >({
                query: () => ({ url: `/api/nowplaying/radio2previously` }),
                providesTags: ["nowplaying"],
            }),
            getRadio3: build.query<GetRadio3ApiResponse, GetRadio3ApiArg>({
                query: () => ({ url: `/api/nowplaying/radio3` }),
                providesTags: ["nowplaying"],
            }),
            getSky: build.query<GetSkyApiResponse, GetSkyApiArg>({
                query: () => ({ url: `/api/nowplaying/sky` }),
                providesTags: ["nowplaying"],
            }),
            getPinguin: build.query<GetPinguinApiResponse, GetPinguinApiArg>({
                query: () => ({ url: `/api/nowplaying/pinguin` }),
                providesTags: ["nowplaying"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as nowplayingApi };
export type GetRadio2ApiResponse =
    /** status 200 getRadio2 */ NowPlayingResponse;
export type GetRadio2ApiArg = void;
export type GetRadio2PreviouslyApiResponse =
    /** status 200 getRadio2Previously */ PreviouslyResponseList;
export type GetRadio2PreviouslyApiArg = void;
export type GetRadio3ApiResponse =
    /** status 200 getRadio3 */ NowPlayingResponse;
export type GetRadio3ApiArg = void;
export type GetSkyApiResponse = /** status 200 getSky */ NowPlayingResponse;
export type GetSkyApiArg = void;
export type GetPinguinApiResponse =
    /** status 200 getPinguin */ NowPlayingResponse;
export type GetPinguinApiArg = void;
export type NowPlayingResponse = {
    artist: string;
    title: string;
    last_updated: string;
    songImageUrl: string;
    name: string;
    imageUrl: string;
};
export type ErrorResponse = {
    /** Time when error happened */
    timestamp?: string;
    /** Code describing the error */
    status?: number;
    /** Short error name */
    error?: string;
    /** Message explaining the error */
    message?: string;
    /** Code of the error */
    code?: number;
};
export type RadioMetadataBroadcast = {
    title?: string;
    presenters?: string;
    imageUrl?: string;
};
export type RadioMetadataTime = {
    start?: string;
    end?: string;
};
export type PreviouslyResponse = NowPlayingResponse & {
    broadcast: RadioMetadataBroadcast;
    time: RadioMetadataTime;
    listenUrl?: string;
};
export type PreviouslyResponseList = PreviouslyResponse[];
export const {
    useGetRadio2Query,
    useGetRadio2PreviouslyQuery,
    useGetRadio3Query,
    useGetSkyQuery,
    useGetPinguinQuery,
} = injectedRtkApi;
