import { IPlaylist, ISong, PlaylistArgs } from "@homeremote/types";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { FC, RefObject } from "react";
import { useGetPlaylistQuery } from "../../../Services/jukeboxApi";
import { LAST_SONG } from "./JukeboxPlayer";

interface IJukeboxSongListProps {
    currentPlaylist: IPlaylist | undefined;
    setCurrentPlaylist: (playlist: IPlaylist | undefined) => void;
    setCurrentSong: (song: ISong) => void;
    audioElemRef: RefObject<HTMLAudioElement>;
}

const JukeboxSongList: FC<IJukeboxSongListProps> = ({
    currentPlaylist,
    setCurrentPlaylist,
    setCurrentSong,
    audioElemRef,
}) => {
    const playlistArgs: PlaylistArgs | typeof skipToken = currentPlaylist?.id
        ? { id: currentPlaylist.id, type: currentPlaylist.type }
        : skipToken;
    const {
        data: playlist,
        isLoading,
        isFetching,
    } = useGetPlaylistQuery(playlistArgs);

    const backButton = (
        <ListItemButton
            onClick={() => {
                setCurrentPlaylist(undefined);
            }}
        >
            <ListItemIcon>
                <ArrowBackIcon />
            </ListItemIcon>
            <ListItemText>back</ListItemText>
        </ListItemButton>
    );

    if (!currentPlaylist?.id) {
        return null;
    }

    if (playlist?.status !== "received") {
        return (
            <List>
                {backButton}
                <ListItem>empty</ListItem>
            </List>
        );
    }

    if (isLoading && isFetching) {
        return null;
    }

    return (
        <List>
            <ListItemButton
                onClick={() => {
                    setCurrentPlaylist(undefined);
                }}
            >
                <ListItemIcon>
                    <ArrowBackIcon />
                </ListItemIcon>
                <ListItemText>back</ListItemText>
            </ListItemButton>
            {playlist?.songs.map((song) => (
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
