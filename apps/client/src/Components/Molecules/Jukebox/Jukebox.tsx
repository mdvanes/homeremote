import {
    Card,
    CardContent,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
} from "@mui/material";
import {
    useGetPlaylistQuery,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { FC, RefObject, useRef, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { ISong, PlaylistArgs } from "@homeremote/types";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import {
    PlayArrow as PlayArrowIcon,
    ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

interface IJukeboxProps {
    play: boolean;
}

interface IJukeboxPlayerProps {
    audioElemRef: RefObject<HTMLAudioElement>;
    song: ISong;
}

const JukeboxPlayer: FC<IJukeboxPlayerProps> = ({ audioElemRef, song }) => {
    // const audioElem = useRef<HTMLAudioElement>(null);
    const hash = song ? btoa(`${song.artist} - ${song.title}`) : "";
    return (
        <div>
            <Typography>
                <IconButton
                    onClick={() => {
                        const elem = audioElemRef.current;
                        if (elem) {
                            elem.pause();
                        }
                    }}
                >
                    <PlayArrowIcon />
                </IconButton>
                {song.artist} - {song.title}
            </Typography>
            <audio
                ref={audioElemRef}
                controls
                src={`${process.env.NX_BASE_URL}/api/jukebox/song/${song.id}?hash=${hash}`}
                onEnded={() => {
                    console.log("song ended");
                    const elem = audioElemRef.current;
                    if (elem) {
                        elem.play();
                    }
                }}
            />
            {/* TODO on finished, play next in playlist on loop */}
        </div>
    );
};

const Jukebox: FC<IJukeboxProps> = ({ play }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPlaylistId, setCurrentPlaylistId] = useState<string>();
    const [currentSong, setCurrentSong] = useState<ISong>();
    // const hash = currentSong
    //     ? btoa(`${currentSong.artist} - ${currentSong.title}`)
    //     : "";
    const { data } = useGetPlaylistsQuery(undefined);
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylistId
        ? { id: currentPlaylistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);

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
                    />
                ) : (
                    // <div>
                    //     <Typography>
                    //         <IconButton
                    //             onClick={() => {
                    //                 const elem = audioElem.current;
                    //                 if (elem) {
                    //                     elem.pause();
                    //                 }
                    //             }}
                    //         >
                    //             <PlayArrow />
                    //         </IconButton>
                    //         {currentSong.artist} - {currentSong.title}
                    //     </Typography>
                    //     <audio
                    //         ref={audioElem}
                    //         controls
                    //         src={`${process.env.NX_BASE_URL}/api/jukebox/song/${currentSong.id}?hash=${hash}`}
                    //         onEnded={() => {
                    //             console.log("song ended");
                    //             const elem = audioElem.current;
                    //             if (elem) {
                    //                 elem.play();
                    //             }
                    //         }}
                    //     />
                    //     {/* TODO on finished, play next in playlist on loop */}
                    // </div>
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
                                    <ListItemIcon>
                                        <ArrowBackIcon />
                                    </ListItemIcon>
                                    <ListItemText>back</ListItemText>
                                </ListItemButton>
                                {playlist.songs.map((song) => (
                                    <ListItemButton
                                        key={song.id}
                                        onClick={() => {
                                            setCurrentSong(song);
                                            // Wait for audio elem loading
                                            setTimeout(() => {
                                                if (audioElemRef.current) {
                                                    audioElemRef.current.play();
                                                }
                                            }, 100);
                                        }}
                                    >
                                        <ListItemText>
                                            {song.artist} - {song.title}
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
