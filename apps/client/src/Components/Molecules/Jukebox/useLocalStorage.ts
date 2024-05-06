import { IPlaylist, ISong } from "@homeremote/types";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logError } from "../LogCard/logSlice";
import { LAST_PLAYLIST, LAST_SONG } from "./JukeboxPlayer";

interface UseLocalStorageArgs {
    setCurrentPlaylist: (playlistId: IPlaylist | undefined) => void;
    setCurrentSong: (song: ISong) => void;
}

export const useLocalStorage = ({
    setCurrentPlaylist,
    setCurrentSong,
}: UseLocalStorageArgs) => {
    const dispatch = useDispatch();

    useEffect(() => {
        try {
            const lastSongStr = localStorage.getItem(LAST_SONG);
            if (lastSongStr) {
                const lastSong: ISong = JSON.parse(lastSongStr);
                setCurrentSong(lastSong);
            }
        } catch (err) {
            dispatch(
                logError(
                    `Jukebox can't get last song: ${(err as string).toString()}`
                )
            );
        }
    }, [setCurrentSong, dispatch]);

    useEffect(() => {
        try {
            const lastPlaylistStr = localStorage.getItem(LAST_PLAYLIST);
            if (lastPlaylistStr) {
                const lastPlaylist: IPlaylist = JSON.parse(lastPlaylistStr);
                setCurrentPlaylist(lastPlaylist);
            }
        } catch (err) {
            dispatch(
                logError(
                    `Jukebox can't get last playlist: ${(
                        err as string
                    ).toString()}`
                )
            );
        }
    }, [setCurrentPlaylist, dispatch]);
};
