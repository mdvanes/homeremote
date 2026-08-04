import { FC, useEffect, useRef } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { useJukeboxPlaybackContext } from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import JukeboxBrowse from "./JukeboxBrowse";
import JukeboxPlayer from "./JukeboxPlayer";

/**
 * Jukebox source for the MusicBar. Owns the hidden audio engine and exposes a
 * compact "browse" button (popover). Current playlist/song state lives in
 * JukeboxPlaybackProvider so other pages (e.g. /jukebox) can start playback
 * too. Visible transport controls live in the unified player.
 */
const Jukebox: FC = () => {
    const { setJukeboxElem } = useHotKeyContext();
    const { currentPlaylist, currentSong } = useJukeboxPlaybackContext();
    const audioElemRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        setJukeboxElem(audioElemRef);
    }, [setJukeboxElem]);

    return (
        <>
            {currentSong && (
                <JukeboxPlayer
                    audioElemRef={audioElemRef}
                    currentPlaylist={currentPlaylist}
                    song={currentSong}
                />
            )}
            <JukeboxBrowse audioElemRef={audioElemRef} />
        </>
    );
};

export default Jukebox;
