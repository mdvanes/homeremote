import { IPlaylist, ISong, PlaylistArgs } from "@homeremote/types";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { skipToken } from "@reduxjs/toolkit/query";
import { FC, RefObject } from "react";
import { useGetPlaylistQuery } from "../../../Services/jukeboxApi";
import { formatPlaybackTime } from "../MusicBar/useJukeboxPlaybackTime";
import { LAST_SONG } from "./JukeboxPlayer";

interface IJukeboxSongListProps {
    currentPlaylist: IPlaylist | undefined;
    setCurrentSong: (song: ISong) => void;
    audioElemRef: RefObject<HTMLAudioElement | null>;
}

const JukeboxSongList: FC<IJukeboxSongListProps> = ({
    currentPlaylist,
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

    if (!currentPlaylist?.id) {
        return null;
    }

    if (playlist?.status !== "received") {
        return (
            <List>
                <ListItem>empty</ListItem>
            </List>
        );
    }

    if (isLoading && isFetching) {
        return null;
    }

    return (
        <List>
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
                    <ListItemText
                        primary={
                            song.track
                                ? /* NOTE: for now API only returns tracknr for albums */
                                  `${song.track}. ${song.title}`
                                : `${song.artist} - ${song.title}`
                        }
                    />
                    <ListItemText
                        sx={{ flex: "0 0 auto", textAlign: "right", pl: 1 }}
                        primary={formatPlaybackTime(song.duration)}
                    />
                </ListItemButton>
            ))}
        </List>
    );
};

export default JukeboxSongList;
