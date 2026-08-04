import { FC } from "react";
import { useGetRecentAlbumsQuery } from "../../../Services/jukeboxApi";
import JukeboxAlbumList from "./JukeboxAlbumList";

interface JukeboxRecentProps {
    onSelectAlbum: (id: string, name: string) => void;
}

/** Tab 2 of the /jukebox page: the most recently added albums. */
const JukeboxRecent: FC<JukeboxRecentProps> = ({ onSelectAlbum }) => {
    const { data, isLoading } = useGetRecentAlbumsQuery();

    return (
        <JukeboxAlbumList
            albums={data?.status === "received" ? data.albums : undefined}
            isLoading={isLoading}
            onSelectAlbum={onSelectAlbum}
        />
    );
};

export default JukeboxRecent;
