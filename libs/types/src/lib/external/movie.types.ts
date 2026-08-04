import { components } from "./generated/movie";

export type MovieApiCalendarItem = components["schemas"]["MovieCalendarItem"];

export type MovieApiCalendarResponse = MovieApiCalendarItem[];
