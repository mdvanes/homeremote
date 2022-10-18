import { ISong, PlaylistArgs, PlaylistResponse } from "@homeremote/types";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, RefObject } from "react";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
    playlistId: string | undefined;
    setCurrentSong: (song: ISong) => void;
}

export const LAST_PLAYLIST_ID = "LAST_PLAYLIST_ID";
export const LAST_SONG = "LAST_SONG";

const getNextSong = (
    response: PlaylistResponse | undefined,
    currentSongId: string
): ISong | null => {
    if (!response || response.status !== "received") {
        console.log("no playlist");
        return null;
    }
    // if (response && response.status === "received") {
    const index = response.songs.findIndex((s) => s.id === currentSongId);

    const isLast = index >= response.songs.length - 1;
    const newPlaylist = isLast
        ? response.songs
        : response.songs.slice(index + 1);
    const nextSong = newPlaylist[0];
    console.log("next:", nextSong.artist, nextSong.title);
    // console.log(pl.map((p) => p.artist).join(", "));
    return nextSong;
    // } else {

    // }
};

const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({
    audioElemRef,
    song,
    playlistId,
    setCurrentSong,
}) => {
    const { data: playlists } = useGetPlaylistsQuery(undefined);
    const playlistArgs: PlaylistArgs | typeof skipToken = playlistId
        ? { id: playlistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);
    // console.log("JukeboxPlayer: playlist=", playlist);
    const hash = song ? btoa(`${song.artist} - ${song.title}`) : "";

    const playlistName =
        playlists?.status === "received"
            ? playlists.playlists.find((p) => p.id === playlistId)?.name
            : "";

    // TODO on finished, play next in playlist on loop_
    // if (playlist && playlist.status === "received") {
    //     const index = playlist.songs.findIndex((s) => s.id === song.id);

    //     const isLast = index >= playlist.songs.length - 1;
    //     const newPlaylist = isLast
    //         ? playlist.songs
    //         : playlist.songs.slice(index + 1);
    //     const nextSong = newPlaylist[0];
    //     console.log("next:", nextSong.artist, nextSong.title);
    //     // console.log(pl.map((p) => p.artist).join(", "));
    // } else {
    //     console.log("no playlist");
    // }

    return (
        <div>
            <Typography sx={{ height: "40px" }}>
                <IconButton
                    onClick={() => {
                        const elem = audioElemRef.current;
                        if (elem) {
                            elem.pause();
                        }
                    }}
                >
                    <PlayArrowIcon />
                </IconButton>
                {song.artist} - {song.title}
            </Typography>
            <Typography
                variant="subtitle2"
                sx={{ height: "25px", marginLeft: "40px" }}
            >
                {playlistName}
            </Typography>
            <div>
                <audio
                    ref={audioElemRef}
                    controls
                    src={`${process.env.NX_BASE_URL}/api/jukebox/song/${song.id}?hash=${hash}`}
                    onEnded={() => {
                        // console.log("song ended");
                        const nextSong = getNextSong(playlist, song.id);
                        if (!nextSong) {
                            return;
                        }
                        setCurrentSong(nextSong);
                        const elem = audioElemRef.current;
                        localStorage.setItem(LAST_SONG, JSON.stringify(song));
                        // Wait for audio elem loading
                        setTimeout(() => {
                            if (elem) {
                                // const index = playlist.findIndex(
                                //     (s) => s.id === song.id
                                // );
                                // const pl = playlist.slice(index);
                                // console.log(pl);

                                elem.play();
                            }
                        }, 100);
                    }}
                />
            </div>
        </div>
    );
};

export default JukeboxPlayer;
