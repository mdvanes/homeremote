import { Card, CardContent } from "@mui/material";
import { FC, useEffect, useState } from "react";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [list, setList] = useState([]);
    useEffect(() => {
        const run = async () => {
            const res = await fetch(
                `${process.env.NX_BASE_URL}/api/jukebox`
            ).then((x) => x.json());
            setList(res.playlists);
        };
        run();
    }, []);
    return (
        <Card sx={{ height: 250 }}>
            <CardContent>
                {play ? "playing" : "stopped"}

                <ul>
                    {list.map((x: any) => (
                        <li>
                            {x.id} {x.name}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
};

export default Jukebox;
