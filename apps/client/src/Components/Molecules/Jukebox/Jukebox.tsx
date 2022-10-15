import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { PlaylistArgs } from "@homeremote/types";
import CardExpandBar from "../CardExpandBar/CardExpandBar";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const audioElem = useRef<HTMLAudioElement>(null);

    if (data?.status !== "received") {
        return null;
    }

    return (
        <Card>
            <CardContent>
                {play ? "playing" : "stopped"}

                {currentSong ? (
                    <div>
                        <Typography>
                            {currentSong.artist} - {currentSong.title}
                        </Typography>
                        <audio
                            ref={audioElem}
                            controls
                            src={`${process.env.NX_BASE_URL}/api/jukebox/song/${currentSong.id}?hash=${hash}`}
                            onEnded={() => {
                                console.log("song ended");
                                const elem = audioElem.current;
                                if (elem) {
                                    elem.play();
                                }
                            }}
                        />
                        {/* TODO on finished, play next in playlist on loop */}
                    </div>
                ) : (
                    <Typography>Select a song</Typography>
                )}

                {isOpen && (
                    <>
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
                    </>
                )}

                <CardExpandBar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    hint="browse"
                />
            </CardContent>
        </Card>
    );
};

export default Jukebox;
