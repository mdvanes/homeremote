import { ISong, PlaylistResponse } from "@homeremote/types";

export const getNextSong = (
    response: PlaylistResponse | undefined,
    currentSongId: string
): ISong | null => {
    if (!response || response.status !== "received") {
        console.error("no playlist");
        return null;
    }

    const index = response.songs.findIndex((s) => s.id === currentSongId);

    const isLast = index >= response.songs.length - 1;
    const newPlaylist = isLast
        ? response.songs
        : response.songs.slice(index + 1);
    const nextSong = newPlaylist[0];

    return nextSong;
};
