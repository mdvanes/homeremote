import { IPlaylist, ISong, PlaylistArgs } from "@homeremote/types";
import { skipToken } from "@reduxjs/toolkit/query";
import { FC, RefObject, useCallback, useEffect } from "react";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { getNextSong } from "./getNextSong";
import { getPrevSong } from "./getPrevSong";

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement | null>;
    song: ISong;
    currentPlaylist: IPlaylist | undefined;
    setCurrentSong: (song: ISong) => void;
}

export const LAST_PLAYLIST = "LAST_PLAYLIST";
export const LAST_SONG = "LAST_SONG";

/**
 * Headless jukebox engine: owns the hidden <audio> element, registers the
 * previous/next handlers with the global hotkey provider and publishes the
 * now-playing info. All visible transport controls live in the MusicBar.
 */
const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({
    audioElemRef,
    song,
    currentPlaylist,
    setCurrentSong,
}) => {
    const {
        setHandlePlayPrev,
        setHandlePlayNext,
        setIsJukeboxPlaying,
        setJukeboxInfo,
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

    // Publish the now-playing info (incl. the playlist cover art) to the bar.
    useEffect(() => {
        const imageUrl = currentPlaylist
            ? `${
                  process.env.NX_PUBLIC_BASE_URL
              }/api/jukebox/coverart/${currentPlaylist.id}?type=${
                  currentPlaylist.type
              }&hash=${encodeURIComponent(currentPlaylist.name)}`
            : "";
        setJukeboxInfo({
            title: song.title,
            artist: song.artist,
            album: playlistName ?? "",
            imageUrl,
        });
    }, [song, playlistName, currentPlaylist, setJukeboxInfo]);

    return (
        <audio
            ref={audioElemRef}
            src={`${process.env.NX_PUBLIC_BASE_URL}/api/jukebox/song/${song.id}?hash=${hash}`}
            onEnded={handlePlayNext}
            onPlay={() => setIsJukeboxPlaying(true)}
            onPause={() => setIsJukeboxPlaying(false)}
            style={{ display: "none" }}
        />
    );
};

export default JukeboxPlayer;
