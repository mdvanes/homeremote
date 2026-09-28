import { IPlaylist } from "@homeremote/types";
import { FC, useMemo } from "react";
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import JukeboxAlbumList from "./JukeboxAlbumList";

/**
 * The `/playlists` endpoint also returns starred albums (for the MusicBar's
 * add-to-playlist dialogs); the Playlists tab only wants real playlists.
 */
export const useUserPlaylists = (): {
    playlists: IPlaylist[] | undefined;
    isLoading: boolean;
    isError: boolean;
} => {
    const { data, isLoading, isError } = useGetPlaylistsQuery(undefined);
    const playlists = useMemo(
        () =>
            data?.status === "received"
                ? data.playlists.filter(
                      (playlist) => playlist.type === "playlist"
                  )
                : undefined,
        [data]
    );
    return {
        playlists,
        isLoading,
        isError: isError || data?.status === "error",
    };
};

interface JukeboxPlaylistsProps {
    onSelectPlaylist: (name: string) => void;
}

/** Tab 4 of the /music page: the Subsonic playlists. */
const JukeboxPlaylists: FC<JukeboxPlaylistsProps> = ({ onSelectPlaylist }) => {
    const { playlists, isLoading } = useUserPlaylists();

    return (
        <JukeboxAlbumList
            albums={playlists}
            isLoading={isLoading}
            onSelectAlbum={(_id, name) => onSelectPlaylist(name)}
        />
    );
};

export default JukeboxPlaylists;
