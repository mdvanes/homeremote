import { ISong } from "@homeremote/types";
import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, RefObject, useEffect, useRef, useState } from "react";
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import JukeboxPlayer from "./JukeboxPlayer";
import JukeboxSongList, { LAST_SONG } from "./JukeboxSongList";

interface IJukeboxProps {
    // play: boolean;
    setJukeboxElem: (elem: RefObject<HTMLAudioElement>) => void;
}

const Jukebox: FC<IJukeboxProps> = ({ setJukeboxElem }) => {
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data } = useGetPlaylistsQuery(undefined);

    useEffect(() => {
        setJukeboxElem(audioElemRef);
    }, [audioElemRef, setJukeboxElem]);

    useEffect(() => {
        try {
            const lastSongStr = localStorage.getItem(LAST_SONG);
            if (lastSongStr) {
                const lastSong: ISong = JSON.parse(lastSongStr);
                setCurrentSong(lastSong);
            }
        } catch (err) {
            console.error(err);
        }
    }, [setCurrentSong]);

    if (data?.status !== "received") {
        return null;
    }

    return (
        <Card>
            <CardContent>
                {/* {play ? "playing" : "stopped"} */}

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
