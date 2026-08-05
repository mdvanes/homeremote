import { Card, CardContent, Tab, Tabs } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import JukeboxFavorites from "../../Molecules/Jukebox/JukeboxFavorites";
import JukeboxFileBrowser, {
    PathEntry,
} from "../../Molecules/Jukebox/JukeboxFileBrowser";
import JukeboxRecent from "../../Molecules/Jukebox/JukeboxRecent";

const JukeboxPage: FC = () => {
    const [tab, setTab] = useState(0);
    const [path, setPath] = useState<PathEntry[]>([]);

    const handleChange = (_: SyntheticEvent, value: number) => {
        setTab(value);
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
        setPath(newPath);
        setTab(0);
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
