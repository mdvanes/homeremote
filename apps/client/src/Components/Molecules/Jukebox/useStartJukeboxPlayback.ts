import { IPlaylist, ISong } from "@homeremote/types";
import { useCallback } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { useJukeboxPlaybackContext } from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import { LAST_PLAYLIST, LAST_SONG } from "./JukeboxPlayer";

/**
 * Starts jukebox playback of `song` within `playlist` (an album or a
 * playlist) from anywhere on the /music page: sets the shared playback
 * context, remembers both in localStorage, pauses the radio and starts the
 * MusicBar's jukebox audio element.
 */
export const useStartJukeboxPlayback = () => {
    const { setCurrentPlaylist, setCurrentSong } = useJukeboxPlaybackContext();
    const { pauseRadio, playJukebox } = useHotKeyContext();

    return useCallback(
        (playlist: IPlaylist, song: ISong) => {
            setCurrentPlaylist(playlist);
            setCurrentSong(song);
            localStorage.setItem(LAST_PLAYLIST, JSON.stringify(playlist));
            localStorage.setItem(LAST_SONG, JSON.stringify(song));
            pauseRadio();
            // Wait for the jukebox audio elem to (re)mount/load
            setTimeout(() => {
                playJukebox();
            }, 100);
        },
        [setCurrentPlaylist, setCurrentSong, pauseRadio, playJukebox]
    );
};
