import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { PlaylistArgs } from "@homeremote/types";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] =
        useState<{ id: string; artist: string; title: string }>();
    const hash = currentSong
        ? btoa(`${currentSong.artist} - ${currentSong.title}`)
        : "";
    const { data } = useGetPlaylistsQuery(undefined);
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylistId
        ? { id: currentPlaylistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);

    if (data?.status !== "received") {
        return null;
    }

    return (
        <Card>
            <CardContent>
                {play ? "playing" : "stopped"}

                {currentSong && (
                    <div>
                        <div>
                            {currentSong.artist} - {currentSong.title}
                        </div>
                        <audio
                            controls
                            src={`${process.env.NX_BASE_URL}/api/jukebox/song/${currentSong.id}?hash=${hash}`}
                        />
                    </div>
                )}

                {!currentPlaylistId && (
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
                )}

                {currentPlaylistId && playlist?.status === "received" && (
                    <List>
                        <ListItemButton
                            onClick={() => {
                                setCurrentPlaylistId(undefined);
                            }}
                        >
                            <ListItemText>&lt; back</ListItemText>
                        </ListItemButton>
                        {playlist.songs.map(({ id, artist, title }) => (
                            <ListItemButton
                                key={id}
                                onClick={() => {
                                    setCurrentSong({
                                        id,
                                        artist,
                                        title,
                                    });
                                }}
                            >
                                <ListItemText>
                                    {artist} - {title}
                                </ListItemText>
                            </ListItemButton>
                        ))}
                    </List>
                )}

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
