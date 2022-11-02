import { ISong, PlaylistArgs } from "@homeremote/types";
import {
    FastRewind as FastRewindIcon,
    FastForward as FastForwardIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, RefObject, useCallback } from "react";
import { getNextSong } from "./getNextSong";
import { getPrevSong } from "./getPrevSong";
import HotKeyCoach from "./HotKeyCoach";

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

    const playNewSong = useCallback(
        (newSong: ISong) => {
            setCurrentSong(newSong);
            const elem = audioElemRef.current;
            localStorage.setItem(LAST_SONG, JSON.stringify(song));
            // Wait for audio elem loading
            setTimeout(() => {
                if (elem) {
                    elem.play();
                }
            }, 100);
        },
        [audioElemRef, setCurrentSong, song]
    );

    const handlePlayPrev = useCallback(() => {
        const prevSong = getPrevSong(playlist, song.id);
        if (!prevSong) {
            return;
        }
        playNewSong(prevSong);
    }, [playNewSong, playlist, song.id]);

    const handlePlayNext = useCallback(() => {
        const nextSong = getNextSong(playlist, song.id);
        if (!nextSong) {
            return;
        }
        playNewSong(nextSong);
    }, [playNewSong, playlist, song.id]);

    return (
        <div>
            <Typography sx={{ height: "44px" }}>
                {song.artist} - {song.title}
            </Typography>
            <Typography variant="subtitle2" sx={{ height: "34px" }}>
                {playlistName}
            </Typography>
            <Stack direction="row">
                <IconButton title="Previous track (a)" onClick={handlePlayPrev}>
                    <FastRewindIcon />
                </IconButton>
                <audio
                    ref={audioElemRef}
                    controls
                    src={`${process.env.NX_BASE_URL}/api/jukebox/song/${song.id}?hash=${hash}`}
                    onEnded={handlePlayNext}
                />
                <IconButton title="Next track (d)" onClick={handlePlayNext}>
                    <FastForwardIcon />
                </IconButton>
                <HotKeyCoach />
            </Stack>
        </div>
    );
};

export default JukeboxPlayer;
