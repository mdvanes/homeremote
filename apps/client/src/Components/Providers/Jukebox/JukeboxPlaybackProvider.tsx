import { IPlaylist, ISong } from "@homeremote/types";
import React, { FC, ReactNode, useContext, useState } from "react";
import { useLocalStorage } from "../../Molecules/Jukebox/useLocalStorage";

export interface JukeboxPlaybackState {
    currentPlaylist: IPlaylist | undefined;
    setCurrentPlaylist: (playlist: IPlaylist | undefined) => void;
    currentSong: ISong | undefined;
    setCurrentSong: (song: ISong) => void;
}

const noop = () => {
    /* */
};

const initialState: JukeboxPlaybackState = {
    currentPlaylist: undefined,
    setCurrentPlaylist: noop,
    currentSong: undefined,
    setCurrentSong: noop,
};

export const JukeboxPlaybackContext = React.createContext(initialState);

export const useJukeboxPlaybackContext = () =>
    useContext(JukeboxPlaybackContext);

/**
 * Shared "now playing" state for the jukebox source: the current
 * playlist/album and song. Lifted out of the MusicBar's Jukebox component so
 * pages outside the bar (e.g. the /jukebox page) can also start playback.
 */
export const JukeboxPlaybackProvider: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    useLocalStorage({ setCurrentPlaylist, setCurrentSong });

    const state: JukeboxPlaybackState = {
        currentPlaylist,
        setCurrentPlaylist,
        currentSong,
        setCurrentSong,
    };

    return (
        <JukeboxPlaybackContext.Provider value={state}>
            {children}
        </JukeboxPlaybackContext.Provider>
    );
};

export default JukeboxPlaybackProvider;
