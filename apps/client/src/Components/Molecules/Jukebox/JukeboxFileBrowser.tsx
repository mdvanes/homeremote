import { BrowseItem, IPlaylist, ISong } from "@homeremote/types";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";
import { useGetBrowseQuery } from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { useJukeboxPlaybackContext } from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import JukeboxAlbumDetail from "./JukeboxAlbumDetail";
import JukeboxArtistList from "./JukeboxArtistList";
import JukeboxDirCardList from "./JukeboxDirCardList";
import { LAST_PLAYLIST, LAST_SONG } from "./JukeboxPlayer";

export interface PathEntry {
    id: string;
    title: string;
}

interface JukeboxFileBrowserProps {
    path: PathEntry[];
    setPath: Dispatch<SetStateAction<PathEntry[]>>;
}

/**
 * Tab 1 of the /jukebox page: navigates the Subsonic library by file system
 * (artists -> albums -> songs, arbitrary depth). Clicking a song starts
 * playback via the shared JukeboxPlaybackProvider, which the persistent
 * MusicBar reads from, so it keeps playing across navigation. The current
 * path is controlled by JukeboxPage so the Recently added/Favorites tabs can
 * also navigate here (open an album's songs).
 *
 * At each level below the artist, the fetched directory's children are
 * either all sub-directories (further albums, or e.g. multi-disc folders)
 * or all songs: dirs render as a horizontal, wrapping card grid (with an
 * artist biography below it at the top level, i.e. an artist's albums);
 * songs render as a list next to the album's cover art/description sidebar.
 */
const JukeboxFileBrowser: FC<JukeboxFileBrowserProps> = ({ path, setPath }) => {
    const { setCurrentPlaylist, setCurrentSong } = useJukeboxPlaybackContext();
    const { pauseRadio, playJukebox } = useHotKeyContext();
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
        // A song's own `artist` field isn't always populated by Subsonic;
        // fall back to any sibling song in the same album that has one.
        const albumArtist =
            item.artist ||
            (data?.status === "received"
                ? data.items.find((sibling) => sibling.artist)?.artist
                : undefined);
        const playlist: IPlaylist = {
            id: currentDir.id,
            name: currentDir.title,
            type: "album",
            artist: albumArtist || undefined,
        };
        const song: ISong = {
            id: item.id,
            artist: albumArtist || "",
            title: item.title,
            duration: item.duration || 0,
            album: item.album,
            track: item.track,
        };
        setCurrentPlaylist(playlist);
        setCurrentSong(song);
        localStorage.setItem(LAST_PLAYLIST, JSON.stringify(playlist));
        localStorage.setItem(LAST_SONG, JSON.stringify(song));
        pauseRadio();
        // Wait for the jukebox audio elem to (re)mount/load
        setTimeout(() => {
            playJukebox();
        }, 100);
    };

    const isSongLevel =
        data?.status === "received" && data.items.some((item) => !item.isDir);

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

            {data?.status === "received" && path.length === 0 && (
                <JukeboxArtistList
                    items={data.items}
                    onSelectArtist={handleOpenDir}
                />
            )}

            {data?.status === "received" && path.length > 0 && !isSongLevel && (
                <JukeboxDirCardList
                    items={data.items}
                    onSelect={handleOpenDir}
                    artistId={path.length === 1 ? currentDir.id : undefined}
                />
            )}

            {data?.status === "received" && path.length > 0 && isSongLevel && (
                <JukeboxAlbumDetail
                    albumId={currentDir.id}
                    albumName={currentDir.title}
                    songs={data.items}
                    onPlaySong={handlePlaySong}
                />
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
