import { components } from "./generated/nowplaying";

export type ISOTimeString = string;

export type NowPlayingResponse = components["schemas"]["NowPlayingResponse"];

export type RadioMetadataTime = components["schemas"]["RadioMetadataTime"];

export type RadioMetadataBroadcast =
    components["schemas"]["RadioMetadataBroadcast"];

export type RadioMetadataSong = components["schemas"]["RadioMetadataSong"];

export type RadioMetadata = components["schemas"]["RadioMetadata"];

export type PreviouslyResponse = components["schemas"]["PreviouslyResponse"];
