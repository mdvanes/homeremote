import { ISong, PlaylistResponse } from "@homeremote/types";

export const getPrevSong = (
    response: PlaylistResponse | undefined,
    currentSongId: string
): ISong | null => {
    if (!response || response.status !== "received") {
        console.error("no playlist");
        return null;
    }

    const index = response.songs.findIndex((s) => s.id === currentSongId);

    const isFirst = index <= 0;

    if (isFirst) {
        // Wrap around to last song
        return response.songs[response.songs.length - 1];
    }

    const prevSong = response.songs.slice(index - 1)[0];

    if (!prevSong) {
        return response.songs[0];
    }

    return prevSong;
};
