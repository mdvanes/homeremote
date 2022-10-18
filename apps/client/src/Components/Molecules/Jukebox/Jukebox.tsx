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
import JukeboxPlayer, { LAST_PLAYLIST_ID, LAST_SONG } from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";

interface IJukeboxProps {
    // play: boolean;
    setJukeboxElem: (elem: RefObject<HTMLAudioElement>) => void;
}

const Jukebox: FC<IJukeboxProps> = ({ setJukeboxElem }) => {
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data, isLoading, isFetching } = useGetPlaylistsQuery(undefined);

    useEffect(() => {
        setJukeboxElem(audioElemRef);
    }, [audioElemRef, setJukeboxElem]);

    // TODO Move both getItems to hook
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

    useEffect(() => {
        try {
            const lastPlaylistId = localStorage.getItem(LAST_PLAYLIST_ID);
            if (lastPlaylistId) {
                setCurrentPlaylistId(lastPlaylistId);
            }
        } catch (err) {
            console.error(err);
        }
    }, [setCurrentPlaylistId]);

    if (data?.status !== "received") {
        return null;
    }

    if (isLoading && isFetching) {
        return null;
    }

    return (
        <Card>
            <CardContent>
                {currentSong ? (
                    <JukeboxPlayer
                        audioElemRef={audioElemRef}
                        playlistId={currentPlaylistId}
                        song={currentSong}
                        setCurrentSong={setCurrentSong}
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
                                            localStorage.setItem(
                                                LAST_PLAYLIST_ID,
                                                id
                                            );
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
