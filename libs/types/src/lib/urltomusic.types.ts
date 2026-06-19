import { components, operations } from "./generated/urlToMusic";

export type SearchResultItem = components["schemas"]["SearchResultItem"];

export type UrlToMusicGetSearchResponse =
    components["schemas"]["UrlToMusicGetSearchResponse"];

export type UrlToMusicGetInfoResponse =
    components["schemas"]["UrlToMusicGetInfoResponse"];

export type UrlToMusicGetMusicResponse =
    components["schemas"]["UrlToMusicGetMusicResponse"];

export type UrlToMusicGetMusicProgressResponse =
    components["schemas"]["UrlToMusicGetMusicProgressResponse"];

export type UrlToMusicGetSearchArgs =
    operations["getSearch"]["parameters"]["path"];

export type UrlToMusicGetInfoArgs = operations["getInfo"]["parameters"]["path"];

export type UrlToMusicGetMusicArgs =
    operations["getMusic"]["parameters"]["path"] &
        operations["getMusic"]["parameters"]["query"];

// Controller-internal download state (mirrors the progress response state enum)
export type UrlToMusicState =
    components["schemas"]["UrlToMusicGetMusicProgressResponse"]["state"];

// Controller-internal helper types (not part of the public API)
export interface UrlToMusicSetMetadataResponse {
    path: string;
    fileName: string;
}

export interface UrlToMusicYdlExecArgs {
    rootPath: string;
    url: string;
    title: string;
    artist: string;
}

export interface UrlToMusicSetMetadataArgs {
    path: string;
    fileName: string;
    title: string;
    artist: string;
    album: string;
}
