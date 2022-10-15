import {
    Card,
    CardContent,
    List,
    // ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import {
    jukeboxApi,
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { PlaylistArgs } from "@homeremote/types";
// import TreeView from "@mui/lab/TreeView";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import TreeItem from "@mui/lab/TreeItem";

// type PlaylistArgs = { id: string };

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const { data } = useGetPlaylistsQuery(undefined);
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylistId
        ? { id: currentPlaylistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);
    // const [getPlaylist] = jukeboxApi.endpoints.getPlaylist.useLazyQuery();

    if (data?.status !== "received") {
        return null;
    }

    const hash = btoa("Thundercat - Dragonball Durag");

    return (
        <Card
            sx={
                {
                    // height: 250
                }
            }
        >
            <CardContent>
                {play ? "playing" : "stopped"}

                {/* <ul>
                    {data?.playlists &&
                        data.playlists.map(({ id, name }) => (
                            <li key={id}>{name}</li>
                        ))}
                </ul> */}

                <div>
                    <audio
                        controls
                        src={`${process.env.NX_BASE_URL}/api/jukebox/song/1350?hash=${hash}`}
                    />
                </div>

                {playlist?.status === "received" && (
                    <List>
                        {playlist.songs.map(({ id, artist, title }) => (
                            <ListItemButton key={id}>
                                <ListItemText>
                                    {artist} - {title}
                                    {/* <audio controls src={url} /> */}
                                </ListItemText>
                            </ListItemButton>
                        ))}
                    </List>
                )}
                <List>
                    {data.playlists.map(({ id, name }) => (
                        <ListItemButton
                            key={id}
                            onClick={() => {
                                setCurrentPlaylistId(id);
                            }}
                        >
                            <ListItemText>{name}</ListItemText>
                        </ListItemButton>
                    ))}
                </List>

                {/* <TreeView
                    aria-label="file system navigator"
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                    sx={{
                        height: 240,
                        flexGrow: 1,
                        maxWidth: 400,
                        overflowY: "auto",
                    }}
                >
                    <TreeItem nodeId="1" label="Applications">
                        <TreeItem nodeId="2" label="Calendar" />
                    </TreeItem>
                    <TreeItem nodeId="5" label="Documents">
                        {data?.playlists &&
                            data.playlists.map(({ id, name }) => (
                                <TreeItem key={id} nodeId={id} label={name} />
                            ))}
                        
                    </TreeItem>
                </TreeView> */}
            </CardContent>
        </Card>
    );
};

export default Jukebox;
