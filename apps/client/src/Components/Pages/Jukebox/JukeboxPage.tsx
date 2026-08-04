import { Card, CardContent, Tab, Tabs } from "@mui/material";
import { FC, SyntheticEvent, useState } from "react";
import JukeboxFileBrowser from "../../Molecules/Jukebox/JukeboxFileBrowser";

const JukeboxPage: FC = () => {
    const [tab, setTab] = useState(0);

    const handleChange = (_: SyntheticEvent, value: number) => {
        setTab(value);
    };

    return (
        <Card>
            <Tabs value={tab} onChange={handleChange}>
                <Tab label="Browse" />
                <Tab label="Recently added" />
                <Tab label="Favorites" />
            </Tabs>
            <CardContent>{tab === 0 && <JukeboxFileBrowser />}</CardContent>
        </Card>
    );
};

export default JukeboxPage;
