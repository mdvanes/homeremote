import { ISong, PlaylistArgs } from "@homeremote/types";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import { IconButton, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, RefObject } from "react";
import { getNextSong } from "./getNextSong";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
    playlistId: string | undefined;
    setCurrentSong: (song: ISong) => void;
}

export const LAST_PLAYLIST_ID = "LAST_PLAYLIST_ID";
export const LAST_SONG = "LAST_SONG";

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
    const hash = song ? btoa(`${song.artist} - ${song.title}`) : "";

    const playlistName =
        playlists?.status === "received"
            ? playlists.playlists.find((p) => p.id === playlistId)?.name
            : "";

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
