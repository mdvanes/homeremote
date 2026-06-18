import { IPlaylist, ISong } from "@homeremote/types";
import { FC, useEffect, useRef, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import JukeboxBrowse from "./JukeboxBrowse";
import JukeboxPlayer from "./JukeboxPlayer";
import { useLocalStorage } from "./useLocalStorage";

/**
 * Jukebox source for the MusicBar. Owns the current playlist/song state and the
 * hidden audio engine, and exposes a compact "browse" button (popover). Visible
 * transport controls live in the unified player.
 */
const Jukebox: FC = () => {
    const { setJukeboxElem } = useHotKeyContext();
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    useLocalStorage({ setCurrentPlaylist, setCurrentSong });

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
                    setCurrentSong={setCurrentSong}
                />
            )}
            <JukeboxBrowse
                audioElemRef={audioElemRef}
                currentPlaylist={currentPlaylist}
                setCurrentPlaylist={setCurrentPlaylist}
                setCurrentSong={setCurrentSong}
            />
        </>
    );
};

export default Jukebox;
