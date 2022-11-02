import { ISong } from "@homeremote/types";
import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import JukeboxPlayer, { LAST_PLAYLIST_ID } from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";
import { useLocalStorage } from "./useLocalStorage";

const Jukebox: FC = () => {
    const { setJukeboxElem } = useHotKeyContext();
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data, isLoading, isFetching } = useGetPlaylistsQuery(undefined);
    useLocalStorage({ setCurrentPlaylistId, setCurrentSong });

    useEffect(() => {
        setJukeboxElem(audioElemRef);
    }, [audioElemRef, setJukeboxElem]);

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
