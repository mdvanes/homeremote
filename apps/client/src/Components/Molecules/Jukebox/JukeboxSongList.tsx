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
import { LAST_SONG } from "./JukeboxPlayer";

interface IJukeboxSongListProps {
    currentPlaylistId: string | undefined;
    setCurrentPlaylistId: (playlistId: string | undefined) => void;
    setCurrentSong: (song: ISong) => void;
    audioElemRef: RefObject<HTMLAudioElement>;
}

const JukeboxSongList: FC<IJukeboxSongListProps> = ({
    currentPlaylistId,
    setCurrentPlaylistId,
    setCurrentSong,
    audioElemRef,
}) => {
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylistId
        ? { id: currentPlaylistId }
        : skipToken;
    const {
        data: playlist,
        isLoading,
        isFetching,
    } = useGetPlaylistQuery(playlistArgs);

    if (playlist?.status !== "received" || !currentPlaylistId) {
        return null;
    }

    if (isLoading && isFetching) {
        return null;
    }

    return (
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
                        localStorage.setItem(LAST_SONG, JSON.stringify(song));
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
