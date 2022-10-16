import { ISong, PlaylistArgs } from "@homeremote/types";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FC, RefObject } from "react";
import { useGetPlaylistQuery } from "../../../Services/jukeboxApi";

interface IJukeboxSongListProps {
    currentPlaylistId: string | undefined;
    setCurrentPlaylistId: (x: string | undefined) => void;
    setCurrentSong: (x: ISong) => void;
    setCurrentPlaylist: (x: ISong[]) => void;
    // songs: ISong[];
    audioElemRef: RefObject<HTMLAudioElement>;
}

const JukeboxSongList: FC<IJukeboxSongListProps> = ({
    currentPlaylistId,
    setCurrentPlaylistId,
    setCurrentPlaylist,
    setCurrentSong,
    // songs,
    audioElemRef,
}) => {
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylistId
        ? { id: currentPlaylistId }
        : skipToken;
    const { data: playlist } = useGetPlaylistQuery(playlistArgs);

    if (playlist?.status !== "received" || !currentPlaylistId) {
        return null;
    }

    return (
        <List>
            <ListItemButton
                onClick={() => {
                    setCurrentPlaylistId(undefined);
                    setCurrentPlaylist(playlist.songs);
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
    );
};

export default JukeboxSongList;
