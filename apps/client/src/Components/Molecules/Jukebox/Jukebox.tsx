import { ISong } from "@homeremote/types";
import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, useRef, useState } from "react";
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import JukeboxPlayer from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";

interface IJukeboxProps {
    play: boolean;
}

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data } = useGetPlaylistsQuery(undefined);

    const audioElemRef = useRef<HTMLAudioElement>(null);

    if (data?.status !== "received") {
        return null;
    }

    return (
        <Card>
            <CardContent>
                {play ? "playing" : "stopped"}

                {currentSong ? (
                    <JukeboxPlayer
                        audioElemRef={audioElemRef}
                        song={currentSong}
                        playlistId={currentPlaylistId}
                    />
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

                        <JukeboxSongList
                            audioElemRef={audioElemRef}
                            currentPlaylistId={currentPlaylistId}
                            setCurrentPlaylistId={setCurrentPlaylistId}
                            setCurrentSong={setCurrentSong}
                        />
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
