import { BrowseItem, IPlaylist, ISong } from "@homeremote/types";
import {
    ArrowBack as ArrowBackIcon,
    Folder as FolderIcon,
    MusicNote as MusicNoteIcon,
} from "@mui/icons-material";
import {
    Box,
    Breadcrumbs,
    Link,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, useState } from "react";
import { useGetBrowseQuery } from "../../../Services/jukeboxApi";
import { useJukeboxPlaybackContext } from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import { LAST_PLAYLIST, LAST_SONG } from "./JukeboxPlayer";

interface PathEntry {
    id: string;
    title: string;
}

interface JukeboxFileBrowserProps {
    initialPath?: PathEntry[];
}

/**
 * Tab 1 of the /jukebox page: navigates the Subsonic library by file system
 * (artists -> albums -> songs, arbitrary depth). Clicking a song starts
 * playback via the shared JukeboxPlaybackProvider, which the persistent
 * MusicBar reads from, so it keeps playing across navigation.
 */
const JukeboxFileBrowser: FC<JukeboxFileBrowserProps> = ({
    initialPath = [],
}) => {
    const [path, setPath] = useState<PathEntry[]>(initialPath);
    const { setCurrentPlaylist, setCurrentSong } = useJukeboxPlaybackContext();
    const currentDir = path[path.length - 1];
    const { data, isLoading } = useGetBrowseQuery(currentDir?.id);

    const handleOpenDir = (item: BrowseItem) => {
        setPath((prev) => [...prev, { id: item.id, title: item.title }]);
    };

    const handleBreadcrumbClick = (index: number) => {
        setPath((prev) => prev.slice(0, index + 1));
    };

    const handlePlaySong = (item: BrowseItem) => {
        if (!currentDir) {
            return;
        }
        const playlist: IPlaylist = {
            id: currentDir.id,
            name: currentDir.title,
            type: "album",
        };
        const song: ISong = {
            id: item.id,
            artist: item.artist || "",
            title: item.title,
            duration: item.duration || 0,
            album: item.album,
            track: item.track,
        };
        setCurrentPlaylist(playlist);
        setCurrentSong(song);
        localStorage.setItem(LAST_PLAYLIST, JSON.stringify(playlist));
        localStorage.setItem(LAST_SONG, JSON.stringify(song));
    };

    return (
        <Box>
            <Breadcrumbs sx={{ mb: 1 }}>
                <Link
                    component="button"
                    underline={path.length === 0 ? "none" : "hover"}
                    onClick={() => setPath([])}
                >
                    Artists
                </Link>
                {path.map((entry, index) => (
                    <Link
                        key={entry.id}
                        component="button"
                        underline={index === path.length - 1 ? "none" : "hover"}
                        onClick={() => handleBreadcrumbClick(index)}
                    >
                        {entry.title}
                    </Link>
                ))}
            </Breadcrumbs>

            {isLoading && (
                <Typography variant="body2" color="text.secondary">
                    Loading…
                </Typography>
            )}

            {data?.status === "received" && (
                <List>
                    {path.length > 0 && (
                        <ListItemButton
                            onClick={() => setPath((prev) => prev.slice(0, -1))}
                        >
                            <ListItemIcon>
                                <ArrowBackIcon />
                            </ListItemIcon>
                            <ListItemText primary="back" />
                        </ListItemButton>
                    )}
                    {data.items.map((item) => (
                        <ListItem key={item.id} disableGutters disablePadding>
                            <ListItemButton
                                onClick={() =>
                                    item.isDir
                                        ? handleOpenDir(item)
                                        : handlePlaySong(item)
                                }
                            >
                                <ListItemIcon>
                                    {item.isDir ? (
                                        <FolderIcon />
                                    ) : (
                                        <MusicNoteIcon />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.title}
                                    secondary={
                                        item.isDir ? undefined : item.artist
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}

            {data?.status === "error" && (
                <Typography variant="body2" color="error">
                    Failed to load
                </Typography>
            )}
        </Box>
    );
};

export default JukeboxFileBrowser;
