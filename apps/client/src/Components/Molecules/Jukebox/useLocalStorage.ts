import { ISong } from "@homeremote/types";
import { useEffect } from "react";
import { LAST_PLAYLIST_ID, LAST_SONG } from "./JukeboxPlayer";
import { useDispatch } from "react-redux";
import { logError } from "../LogCard/logSlice";

interface UseLocalStorageArgs {
    setCurrentPlaylistId: (playlistId: string | undefined) => void;
    setCurrentSong: (song: ISong) => void;
}

export const useLocalStorage = ({
    setCurrentPlaylistId,
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
            const lastPlaylistId = localStorage.getItem(LAST_PLAYLIST_ID);
            if (lastPlaylistId) {
                setCurrentPlaylistId(lastPlaylistId);
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
    }, [setCurrentPlaylistId, dispatch]);
};
