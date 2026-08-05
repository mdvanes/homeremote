import { IPlaylist } from "@homeremote/types";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC } from "react";

interface JukeboxAlbumListProps {
    albums: IPlaylist[] | undefined;
    isLoading: boolean;
    onSelectAlbum: (
        id: string,
        name: string,
        artist?: string,
        artistId?: string
    ) => void;
}

/**
 * Shared list rendering for album entry points (Recently added, Favorites):
 * clicking an album opens its songs in the Browse tab.
 */
const JukeboxAlbumList: FC<JukeboxAlbumListProps> = ({
    albums,
    isLoading,
    onSelectAlbum,
}) => {
    if (isLoading) {
        return (
            <Typography variant="body2" color="text.secondary">
                Loading…
            </Typography>
        );
    }

    if (!albums || albums.length === 0) {
        return (
            <Typography variant="body2" color="text.secondary">
                Nothing here yet
            </Typography>
        );
    }

    return (
        <List>
            {albums.map(({ id, name, type, artist, artistId }) => (
                <ListItem key={id} disableGutters disablePadding>
                    <ListItemButton
                        onClick={() =>
                            onSelectAlbum(id, name, artist, artistId)
                        }
                    >
                        <ListItemAvatar>
                            <Avatar
                                src={`${
                                    process.env.NX_PUBLIC_BASE_URL
                                }/api/jukebox/coverart/${id}?type=${type}&hash=${encodeURIComponent(
                                    name
                                )}`}
                            />
                        </ListItemAvatar>
                        <ListItemText primary={name} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default JukeboxAlbumList;
