import { http, HttpResponse } from "msw";
import {
    NowPlayingResponse,
    PreviouslyResponseList,
} from "../../Services/generated/nowplayingApi";
import { svgDataUri } from "../data/placeholder";
import { isoNow } from "../data/random";

const nowPlaying = (
    stationName: string,
    artist: string,
    title: string
): NowPlayingResponse => ({
    artist,
    title,
    last_updated: isoNow(),
    songImageUrl: svgDataUri(`${artist} ${title}`),
    name: stationName,
    imageUrl: svgDataUri(stationName, 96, 96),
});

const TRACKS: [string, string][] = [
    ["The Midnight", "Sunset"],
    ["Tycho", "Awake"],
    ["Bonobo", "Kerala"],
    ["Khruangbin", "Time (You and I)"],
    ["Foals", "Mountain at My Gates"],
    ["RÜFÜS DU SOL", "Innerbloom"],
];

const previously = (stationName: string): PreviouslyResponseList =>
    TRACKS.map(([artist, title], i) => ({
        ...nowPlaying(stationName, artist, title),
        last_updated: isoNow(-i * 4 * 60_000),
        broadcast: {
            title: `${stationName} Live`,
            presenters: "Demo Presenter",
            imageUrl: svgDataUri(stationName, 96, 96),
        },
        time: {
            start: isoNow(-i * 4 * 60_000),
            end: isoNow(-(i - 1) * 4 * 60_000),
        },
    }));

export const nowPlayingHandlers = [
    http.get("*/api/nowplaying/radio2", () =>
        HttpResponse.json(nowPlaying("Radio 2", "The Midnight", "Sunset"))
    ),
    http.get("*/api/nowplaying/radio2previously", () =>
        HttpResponse.json(previously("Radio 2"))
    ),
    http.get("*/api/nowplaying/radio3", () =>
        HttpResponse.json(nowPlaying("Radio 3", "Tycho", "Awake"))
    ),
    http.get("*/api/nowplaying/sky", () =>
        HttpResponse.json(nowPlaying("Sky Radio", "Bonobo", "Kerala"))
    ),
    http.get("*/api/nowplaying/pinguin", () =>
        HttpResponse.json(
            nowPlaying("Pinguin Radio", "Khruangbin", "Time (You and I)")
        )
    ),
];
