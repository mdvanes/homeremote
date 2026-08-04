import { components } from "./generated/tvshow";

export type TvShowApiEpisode = components["schemas"]["TvShowEpisode"];

export type TvShowApiCalendarResponse = TvShowApiEpisode[];
