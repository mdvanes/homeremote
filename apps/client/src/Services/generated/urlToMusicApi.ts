import { emptyApi as api } from "../emptyApi";
export const addTagTypes = ["urlToMusic"] as const;
const injectedRtkApi = api
    .enhanceEndpoints({
        addTagTypes,
    })
    .injectEndpoints({
        endpoints: (build) => ({
            getSearch: build.query<GetSearchApiResponse, GetSearchApiArg>({
                query: (queryArg) => ({
                    url: `/api/urltomusic/getsearch/${queryArg.terms}`,
                }),
                providesTags: ["urlToMusic"],
            }),
            getInfo: build.query<GetInfoApiResponse, GetInfoApiArg>({
                query: (queryArg) => ({
                    url: `/api/urltomusic/getinfo/${queryArg.url}`,
                }),
                providesTags: ["urlToMusic"],
            }),
            getMusic: build.query<GetMusicApiResponse, GetMusicApiArg>({
                query: (queryArg) => ({
                    url: `/api/urltomusic/getmusic/${queryArg.url}`,
                    params: {
                        artist: queryArg.artist,
                        title: queryArg.title,
                        album: queryArg.album,
                    },
                }),
                providesTags: ["urlToMusic"],
            }),
            getMusicProgress: build.query<
                GetMusicProgressApiResponse,
                GetMusicProgressApiArg
            >({
                query: (queryArg) => ({
                    url: `/api/urltomusic/getmusic/${queryArg.url}/progress`,
                }),
                providesTags: ["urlToMusic"],
            }),
        }),
        overrideExisting: false,
    });
export { injectedRtkApi as urlToMusicApi };
export type GetSearchApiResponse =
    /** status 200 getSearch */ UrlToMusicGetSearchResponse;
export type GetSearchApiArg = {
    /** Search terms */
    terms: string;
};
export type GetInfoApiResponse =
    /** status 200 getInfo */ UrlToMusicGetInfoResponse;
export type GetInfoApiArg = {
    /** URL-encoded source URL */
    url: string;
};
export type GetMusicApiResponse =
    /** status 200 getMusic */ UrlToMusicGetMusicResponse;
export type GetMusicApiArg = {
    /** URL-encoded source URL */
    url: string;
    /** Artist for the mp3 metadata */
    artist: string;
    /** Title for the mp3 metadata */
    title: string;
    /** Album for the mp3 metadata */
    album: string;
};
export type GetMusicProgressApiResponse =
    /** status 200 getMusicProgress */ UrlToMusicGetMusicProgressResponse;
export type GetMusicProgressApiArg = {
    /** URL-encoded source URL */
    url: string;
};
export type SearchResultItem = {
    title?: string;
    id?: string;
};
export type UrlToMusicGetSearchResponse = {
    searchResults: SearchResultItem[];
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
export type UrlToMusicGetInfoResponse = {
    title: string;
    artist: string;
    streamUrl: string[];
    versionInfo: string;
};
export type UrlToMusicGetMusicResponse = {
    url: string;
};
export type UrlToMusicGetMusicProgressResponse = {
    url: string;
    /** Current download state */
    state: "idle" | "downloading" | "finished" | "error";
    /** Path to the resulting file, present when state is finished */
    path?: string;
};
export const {
    useGetSearchQuery,
    useGetInfoQuery,
    useGetMusicQuery,
    useGetMusicProgressQuery,
} = injectedRtkApi;
