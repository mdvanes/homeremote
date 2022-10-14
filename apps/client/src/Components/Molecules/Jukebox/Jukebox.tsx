import { Card, CardContent } from "@mui/material";
import { useGetPlaylistsQuery } from "apps/client/src/Services/jukeboxApi";
import { FC } from "react";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const { data } = useGetPlaylistsQuery(undefined);

    return (
        <Card sx={{ height: 250 }}>
            <CardContent>
                {play ? "playing" : "stopped"}

                <ul>
                    {data?.playlists &&
                        data.playlists.map(({ id, name }) => (
                            <li key={id}>{name}</li>
                        ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default Jukebox;
