import { IPlaylist, ISong, PlaylistArgs } from "@homeremote/types";
import {
    FastForward as FastForwardIcon,
    FastRewind as FastRewindIcon,
    Forward10 as Forward10Icon,
} from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FC, RefObject, useCallback, useEffect } from "react";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { AddSongToPlaylistButton } from "./AddSongToPlaylistButton";
import HotKeyCoach from "./HotKeyCoach";
import { getNextSong } from "./getNextSong";
import { getPrevSong } from "./getPrevSong";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
    currentPlaylist: IPlaylist | undefined;
    setCurrentSong: (song: ISong) => void;
}

export const LAST_PLAYLIST = "LAST_PLAYLIST";
export const LAST_SONG = "LAST_SONG";

const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({
    audioElemRef,
    song,
    currentPlaylist,
    setCurrentSong,
}) => {
    const {
        setHandlePlayPrev,
        setHandlePlayNext,
        handleSkipRadio,
        isSkipRadioActive,
    } = useHotKeyContext();
    const { data: playlists } = useGetPlaylistsQuery(undefined);
    const playlistId = currentPlaylist?.id;
    const playlistArgs: PlaylistArgs | typeof skipToken = playlistId
        ? { id: playlistId, type: currentPlaylist?.type }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);
    const hash = song
        ? encodeURIComponent(`${song.artist} - ${song.title}`)
        : "";

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

    useEffect(() => {
        setHandlePlayPrev(() => handlePlayPrev);
    }, [handlePlayPrev, setHandlePlayPrev]);

    useEffect(() => {
        setHandlePlayNext(() => handlePlayNext);
    }, [handlePlayNext, setHandlePlayNext]);

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

                {isSkipRadioActive ? (
                    <IconButton title="Skip radio in progress!">
                        <Forward10Icon color="secondary" />
                    </IconButton>
                ) : (
                    <IconButton title="Skip radio" onClick={handleSkipRadio}>
                        <Forward10Icon />
                    </IconButton>
                )}

                <HotKeyCoach />

                <AddSongToPlaylistButton />
            </Stack>
        </div>
    );
};

export default JukeboxPlayer;
