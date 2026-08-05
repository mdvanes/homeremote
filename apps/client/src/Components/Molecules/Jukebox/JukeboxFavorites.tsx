import { FC } from "react";
import { useGetFavoritesQuery } from "../../../Services/jukeboxApi";
import JukeboxAlbumList from "./JukeboxAlbumList";

interface JukeboxFavoritesProps {
    onSelectAlbum: (
        id: string,
        name: string,
        artist?: string,
        artistId?: string
    ) => void;
}

/** Tab 3 of the /jukebox page: starred/favorite albums. */
const JukeboxFavorites: FC<JukeboxFavoritesProps> = ({ onSelectAlbum }) => {
    const { data, isLoading } = useGetFavoritesQuery();

    return (
        <JukeboxAlbumList
            albums={data?.status === "received" ? data.albums : undefined}
            isLoading={isLoading}
            onSelectAlbum={onSelectAlbum}
        />
    );
};

export default JukeboxFavorites;
