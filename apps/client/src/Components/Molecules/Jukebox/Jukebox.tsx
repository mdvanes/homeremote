import { Card, CardContent } from "@mui/material";
import { FC } from "react";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    return (
        <Card sx={{ height: 250 }}>
            <CardContent>{play ? "playing" : "stopped"}</CardContent>
        </Card>
    );
};

export default Jukebox;
