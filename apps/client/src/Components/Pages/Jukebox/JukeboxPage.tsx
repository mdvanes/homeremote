import { Card, CardContent, Tab, Tabs } from "@mui/material";
import { Dispatch, FC, SetStateAction, SyntheticEvent } from "react";
import { useSearchParams } from "react-router";
import JukeboxFavorites from "../../Molecules/Jukebox/JukeboxFavorites";
import JukeboxFileBrowser, {
    PathEntry,
} from "../../Molecules/Jukebox/JukeboxFileBrowser";
import JukeboxRecent from "../../Molecules/Jukebox/JukeboxRecent";

const TAB_COUNT = 3;

const parsePath = (raw: string | null): PathEntry[] => {
    if (!raw) {
        return [];
    }
    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter(
            (entry): entry is PathEntry =>
                typeof entry?.id === "string" &&
                typeof entry?.title === "string"
        );
    } catch {
        return [];
    }
};

/**
 * Tab and Browse-tab path are kept in the URL (query params `tab`/`path`) so
 * a browser refresh (or the back/forward buttons) returns to the same view.
 */
const JukeboxPage: FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tabParam = parseInt(searchParams.get("tab") || "0", 10);
    const tab = tabParam >= 0 && tabParam < TAB_COUNT ? tabParam : 0;
    const path = parsePath(searchParams.get("path"));

    const setPath: Dispatch<SetStateAction<PathEntry[]>> = (update) => {
        setSearchParams(
            (prev) => {
                const currentPath = parsePath(prev.get("path"));
                const nextPath =
                    typeof update === "function" ? update(currentPath) : update;
                const next = new URLSearchParams(prev);
                if (nextPath.length > 0) {
                    next.set("path", JSON.stringify(nextPath));
                } else {
                    next.delete("path");
                }
                return next;
            },
            { replace: true }
        );
    };

    const handleChange = (_: SyntheticEvent, value: number) => {
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", String(value));
                return next;
            },
            { replace: true }
        );
    };

    const navigateToAlbum = (
        id: string,
        name: string,
        artist?: string,
        artistId?: string
    ) => {
        const newPath: PathEntry[] =
            artist && artistId ? [{ id: artistId, title: artist }] : [];
        newPath.push({ id, title: name });
        setSearchParams(
            (prev) => {
                const next = new URLSearchParams(prev);
                next.set("tab", "0");
                next.set("path", JSON.stringify(newPath));
                return next;
            },
            { replace: true }
        );
    };

    return (
        <Card>
            <Tabs value={tab} onChange={handleChange}>
                <Tab label="Browse" />
                <Tab label="Recently added" />
                <Tab label="Favorites" />
            </Tabs>
            <CardContent>
                {tab === 0 && (
                    <JukeboxFileBrowser path={path} setPath={setPath} />
                )}
                {tab === 1 && <JukeboxRecent onSelectAlbum={navigateToAlbum} />}
                {tab === 2 && (
                    <JukeboxFavorites onSelectAlbum={navigateToAlbum} />
                )}
            </CardContent>
        </Card>
    );
};

export default JukeboxPage;
