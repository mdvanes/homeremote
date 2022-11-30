export interface UrlToMusicGetInfoResponse {
    title: string;
    artist: string;
    streamUrl: string[];
    versionInfo: string;
}

export interface UrlToMusicGetInfoArgs {
    url: string;
}

export interface UrlToMusicSetMetadataResponse {
    path: string;
    fileName: string;
}

export interface UrlToMusicGetMusicResponse {
    url: string;
}

export interface UrlToMusicGetMusicArgs {
    url: string;
    title: string;
    artist: string;
    album: string;
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

export interface SearchResultItem {
    title?: string;
    id?: string;
}

export interface UrlToMusicGetSearchResponse {
    searchResults: SearchResultItem[];
}

export interface UrlToMusicGetSearchArgs {
    terms: string;
}

export type UrlToMusicState = "idle" | "downloading" | "finished" | "error";

export type UrlToMusicGetMusicProgressResponse =
    | {
          url: string;
          state: "idle" | "downloading";
      }
    | {
          url: string;
          state: "finished";
          path: string;
      };
