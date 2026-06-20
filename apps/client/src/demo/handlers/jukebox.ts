import {
    AddSongResponse,
    IPlaylist,
    ISong,
    PlaylistResponse,
    PlaylistsResponse,
    SongDirResponse,
} from "@homeremote/types";
import { http, HttpResponse } from "msw";
import { hexId, seeded } from "../data/random";

const playlists: IPlaylist[] = [
    { id: "pl1", name: "Focus Flow", type: "playlist", coverArt: "pl1" },
    { id: "pl2", name: "Evening Chill", type: "playlist", coverArt: "pl2" },
    { id: "pl3", name: "Demo Greatest Hits", type: "album", coverArt: "pl3" },
];

const ARTISTS = ["Tycho", "Bonobo", "The Midnight", "Khruangbin", "Foals"];
const TITLES = [
    "Sunrise",
    "Kerala",
    "Days",
    "Time",
    "Mountain",
    "Innerbloom",
    "Awake",
    "Horizon",
];

const songsFor = (playlistId: string): ISong[] => {
    const rand = seeded(playlistId.length * 7 + 13);
    return Array.from({ length: 8 }, (_, i) => ({
        id: `${playlistId}-song-${i}`,
        artist: ARTISTS[Math.floor(rand() * ARTISTS.length)],
        title: TITLES[Math.floor(rand() * TITLES.length)],
        album: "Demo Album",
        duration: 180 + Math.floor(rand() * 180),
        track: i + 1,
    }));
};

export const jukeboxHandlers = [
    http.get("*/api/jukebox/playlists", () =>
        HttpResponse.json<PlaylistsResponse>({ status: "received", playlists })
    ),
    http.get("*/api/jukebox/playlist/:id", ({ params }) =>
        HttpResponse.json<PlaylistResponse>({
            status: "received",
            songs: songsFor(String(params.id)),
        })
    ),
    http.get("*/api/jukebox/songdir", () =>
        HttpResponse.json<SongDirResponse>({
            status: "received",
            dir: {
                album: "Demo Album",
                artist: "Demo Artist",
                created: new Date().toISOString(),
                id: hexId(8),
                isDir: true,
                parent: "root",
                playCount: 3,
                title: "Demo Directory",
            },
            content: Array.from({ length: 6 }, (_, i) => ({
                id: `dir-song-${i}`,
                parent: "root",
                isDir: false,
                title: TITLES[i % TITLES.length],
                album: "Demo Album",
                artist: ARTISTS[i % ARTISTS.length],
                size: 6_000_000 + i * 100_000,
                contentType: "audio/mp3",
                suffix: "mp3",
                duration: 200 + i * 10,
                bitRate: 320,
                path: `Demo Artist/Demo Album/${i + 1}.mp3`,
                playCount: i,
                created: new Date().toISOString(),
                albumId: "album-1",
                artistId: "artist-1",
                type: "music",
            })),
        })
    ),
    http.post("*/api/jukebox/addsongtoplaylist", () =>
        HttpResponse.json<AddSongResponse>({ status: "received" })
    ),
];
