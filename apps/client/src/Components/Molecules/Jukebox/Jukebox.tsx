import { IPlaylist, ISong } from "@homeremote/types";
import {
    Card,
    CardContent,
    List,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { FC, useEffect, useRef, useState } from "react";
import {
    useGetPlaylistsQuery,
    useGetStarredQuery,
} from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import JukeboxPlayer, { LAST_PLAYLIST_ID } from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";
import { useLocalStorage } from "./useLocalStorage";

const Jukebox: FC = () => {
    const { setJukeboxElem } = useHotKeyContext();
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data, isLoading, isFetching } = useGetPlaylistsQuery(undefined);
    const { data: data1 } = useGetStarredQuery(undefined);
    console.log(data1?.albums);
    useLocalStorage({ setCurrentPlaylist, setCurrentSong });

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
                        playlistId={currentPlaylist?.id}
                        song={currentSong}
                        setCurrentSong={setCurrentSong}
                    />
                ) : (
                    <Typography>Select a song</Typography>
                )}

                {isOpen && (
                    <>
                        {!currentPlaylist && (
                            <List>
                                {data.playlists.map((playlist) => {
                                    const { id, name } = playlist;
                                    return (
                                        <ListItemButton
                                            key={id}
                                            onClick={() => {
                                                setCurrentPlaylist(playlist);
                                                localStorage.setItem(
                                                    LAST_PLAYLIST_ID,
                                                    id
                                                );
                                            }}
                                        >
                                            <ListItemText>{name}</ListItemText>
                                        </ListItemButton>
                                    );
                                })}
                            </List>
                        )}

                        <JukeboxSongList
                            audioElemRef={audioElemRef}
                            currentPlaylist={currentPlaylist}
                            setCurrentPlaylist={setCurrentPlaylist}
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
