import { IPlaylist, ISong } from "@homeremote/types";
import {
    QueueMusic as QueueMusicIcon,
    Star as StarIcon,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Popover,
    Tooltip,
    Typography,
} from "@mui/material";
import { FC, RefObject, useState } from "react";
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import { AddSongToPlaylistButton } from "./AddSongToPlaylistButton";
import { LAST_PLAYLIST } from "./JukeboxPlayer";
import JukeboxSongList from "./JukeboxSongList";

interface JukeboxBrowseProps {
    audioElemRef: RefObject<HTMLAudioElement | null>;
    currentPlaylist: IPlaylist | undefined;
    setCurrentPlaylist: (playlist: IPlaylist | undefined) => void;
    setCurrentSong: (song: ISong) => void;
}

/**
 * Compact "browse" entry point for the jukebox: a single icon button that opens
 * a popover with the playlist browser and song list, so it no longer occupies
 * space in the bottom bar.
 */
const JukeboxBrowse: FC<JukeboxBrowseProps> = ({
    audioElemRef,
    currentPlaylist,
    setCurrentPlaylist,
    setCurrentSong,
}) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { data } = useGetPlaylistsQuery(undefined);

    const handleSelectSong = (song: ISong) => {
        setCurrentSong(song);
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Browse playlists">
                <IconButton
                    aria-label="Browse playlists"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <QueueMusicIcon />
                </IconButton>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
                disableScrollLock
            >
                <Box sx={{ width: 360, maxHeight: 440, overflowY: "auto" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            px: 1,
                            pt: 1,
                        }}
                    >
                        <Typography variant="subtitle2">Browse</Typography>
                        <Tooltip title="Add current song to a playlist">
                            <span>
                                <AddSongToPlaylistButton />
                            </span>
                        </Tooltip>
                    </Box>

                    {data?.status !== "received" ? (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Loading…
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            {!currentPlaylist && (
                                <List>
                                    {data.playlists.map((playlist) => {
                                        const { id, name, type } = playlist;
                                        return (
                                            <ListItem
                                                key={id}
                                                disableGutters
                                                disablePadding
                                            >
                                                <ListItemButton
                                                    onClick={() => {
                                                        setCurrentPlaylist(
                                                            playlist
                                                        );
                                                        localStorage.setItem(
                                                            LAST_PLAYLIST,
                                                            JSON.stringify(
                                                                playlist
                                                            )
                                                        );
                                                    }}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            src={`${
                                                                process.env
                                                                    .NX_PUBLIC_BASE_URL
                                                            }/api/jukebox/coverart/${id}?type=${type}&hash=${encodeURIComponent(
                                                                name
                                                            )}`}
                                                        />
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={name}
                                                    />
                                                    <div>
                                                        {type === "album" && (
                                                            <StarIcon fontSize="small" />
                                                        )}
                                                    </div>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            )}

                            <JukeboxSongList
                                audioElemRef={audioElemRef}
                                currentPlaylist={currentPlaylist}
                                setCurrentPlaylist={setCurrentPlaylist}
                                setCurrentSong={handleSelectSong}
                            />
                        </>
                    )}
                </Box>
            </Popover>
        </>
    );
};

export default JukeboxBrowse;
