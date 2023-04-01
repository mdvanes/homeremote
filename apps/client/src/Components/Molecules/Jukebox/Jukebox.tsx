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
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import JukeboxPlayer, { LAST_PLAYLIST } from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";
import { useLocalStorage } from "./useLocalStorage";
import { Star as StarIcon } from "@mui/icons-material";

const Jukebox: FC = () => {
    const { setJukeboxElem } = useHotKeyContext();
    const audioElemRef = useRef<HTMLAudioElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylist, setCurrentPlaylist] = useState<IPlaylist>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    const { data, isLoading, isFetching } = useGetPlaylistsQuery(undefined);
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
                                    const { id, name, type } = playlist;
                                    return (
                                        <ListItemButton
                                            key={id}
                                            onClick={() => {
                                                setCurrentPlaylist(playlist);
                                                localStorage.setItem(
                                                    LAST_PLAYLIST,
                                                    JSON.stringify(playlist)
                                                );
                                            }}
                                        >
                                            <ListItemText>
                                                {type === "album" && (
                                                    <StarIcon fontSize="small" />
                                                )}{" "}
                                                {name}
                                            </ListItemText>
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
