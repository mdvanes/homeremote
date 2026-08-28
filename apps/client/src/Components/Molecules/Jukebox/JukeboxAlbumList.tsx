import { IPlaylist } from "@homeremote/types";
import { MusicNote as MusicNoteIcon } from "@mui/icons-material";
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
        <List
            sx={{
                columns: { xs: 1, sm: 2, md: 3 },
                columnGap: 2,
            }}
        >
            {albums.map(({ id, name, type, artist, artistId }) => (
                <ListItem
                    key={id}
                    disableGutters
                    disablePadding
                    sx={{ display: "block", breakInside: "avoid" }}
                >
                    <ListItemButton
                        onClick={() =>
                            onSelectAlbum(id, name, artist, artistId)
                        }
                    >
                        <ListItemAvatar>
                            <Avatar
                                sx={{
                                    bgcolor: "grey.800",
                                    color: "grey.100",
                                }}
                                src={`${
                                    process.env.NX_PUBLIC_BASE_URL
                                }/api/jukebox/coverart/${id}?type=${type}&hash=${encodeURIComponent(
                                    name
                                )}`}
                            >
                                <MusicNoteIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={name} secondary={artist} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

export default JukeboxAlbumList;
