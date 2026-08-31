import {
    Box,
    Card,
    CircularProgress,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material";
import { FC, SyntheticEvent, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import {
    buildMusicBrowsePath,
    decodeMusicSegment,
    ROUTES,
} from "../../../routes";
import { AddSongToPlaylistButton } from "../../Molecules/Jukebox/AddSongToPlaylistButton";
import JukeboxFavorites from "../../Molecules/Jukebox/JukeboxFavorites";
import JukeboxFileBrowser, {
    PathEntry,
} from "../../Molecules/Jukebox/JukeboxFileBrowser";
import JukeboxRecent from "../../Molecules/Jukebox/JukeboxRecent";
import { useBrowsePathResolver } from "../../Molecules/Jukebox/useBrowsePathResolver";
import { SongNotificationToggle } from "../../Molecules/MusicBar/SongNotificationToggle";

// Approximate space taken up by the AppBar, page margins and the fixed
// bottom MusicBar, so the page itself never needs to scroll - only the tab
// content below the (always visible) Tabs row does.
const JUKEBOX_PAGE_HEIGHT = "calc(100vh - 210px)";

const TAB_PATHS = [
    ROUTES.musicBrowse,
    ROUTES.musicRecent,
    ROUTES.musicFavorites,
];

const tabForPathname = (pathname: string): number => {
    if (pathname.startsWith(ROUTES.musicRecent)) {
        return 1;
    }
    if (pathname.startsWith(ROUTES.musicFavorites)) {
        return 2;
    }
    return 0;
};

/**
 * Tab and Browse-tab path both live in the URL (`/music/browse/<title>/...`,
 * `/music/recent`, `/music/favorites`) so a browser refresh, a pasted link,
 * or the back/forward buttons all return to the exact same view.
 */
const JukeboxPage: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // Only populated when this instance is rendered by the `musicBrowsePath`
    // ("/music/browse/*") route; undefined for the recent/favorites routes.
    const params = useParams<{ "*": string }>();

    const tab = tabForPathname(location.pathname);

    const segments = useMemo(() => {
        const splat = params["*"] ?? "";
        return splat.split("/").filter(Boolean).map(decodeMusicSegment);
    }, [params]);

    const resolution = useBrowsePathResolver(segments);

    const handleChange = (_: SyntheticEvent, value: number) => {
        navigate(TAB_PATHS[value]);
    };

    const navigateToAlbum = (
        id: string,
        name: string,
        artist?: string,
        artistId?: string
    ) => {
        const entries: PathEntry[] =
            artist && artistId ? [{ id: artistId, title: artist }] : [];
        entries.push({ id, title: name });
        navigate(buildMusicBrowsePath(entries), { state: entries });
    };

    const handleBrowseNavigate = (path: PathEntry[]) => {
        navigate(buildMusicBrowsePath(path), { state: path });
    };

    return (
        <Card
            sx={{
                height: JUKEBOX_PAGE_HEIGHT,
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexShrink: 0,
                }}
            >
                <Tabs value={tab} onChange={handleChange}>
                    <Tab label="Browse" />
                    <Tab label="Recently added" />
                    <Tab label="Favorites" />
                </Tabs>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Tooltip title="Add current song to a playlist">
                        <span>
                            <AddSongToPlaylistButton />
                        </span>
                    </Tooltip>
                    <SongNotificationToggle />
                </Box>
            </Box>
            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: "auto",
                    p: 2,
                }}
            >
                {tab === 0 && resolution.status === "resolving" && (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            mt: 4,
                        }}
                    >
                        <CircularProgress size={24} />
                    </Box>
                )}
                {tab === 0 && resolution.status === "notFound" && (
                    <Typography variant="body2" color="error">
                        That path could not be found.
                    </Typography>
                )}
                {tab === 0 && resolution.status === "resolved" && (
                    <JukeboxFileBrowser
                        path={resolution.entries}
                        onNavigate={handleBrowseNavigate}
                    />
                )}
                {tab === 1 && <JukeboxRecent onSelectAlbum={navigateToAlbum} />}
                {tab === 2 && (
                    <JukeboxFavorites onSelectAlbum={navigateToAlbum} />
                )}
            </Box>
        </Card>
    );
};

export default JukeboxPage;
