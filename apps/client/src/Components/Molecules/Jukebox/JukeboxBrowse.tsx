import { ISong } from "@homeremote/types";
import { QueueMusic as QueueMusicIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    Popover,
    Tooltip,
    Typography,
} from "@mui/material";
import { FC, RefObject, useState } from "react";
import { useJukeboxPlaybackContext } from "../../Providers/Jukebox/JukeboxPlaybackProvider";
import JukeboxSongList from "./JukeboxSongList";

interface JukeboxBrowseProps {
    audioElemRef: RefObject<HTMLAudioElement | null>;
}

/**
 * Compact "current playlist" entry point for the MusicBar: a single icon
 * button that opens a popover showing the songs of the currently playing
 * playlist/album (with its avatar, name and artist), so it no longer
 * occupies space in the bottom bar. Selecting a different playlist/album
 * happens on the /jukebox page; this popover is read-only over whatever is
 * already playing.
 */
const JukeboxBrowse: FC<JukeboxBrowseProps> = ({ audioElemRef }) => {
    const { currentPlaylist, setCurrentSong } = useJukeboxPlaybackContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleSelectSong = (song: ISong) => {
        setCurrentSong(song);
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Current playlist songs">
                <IconButton
                    aria-label="Current playlist songs"
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
                    {currentPlaylist ? (
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 1.5,
                                pt: 1.5,
                                pb: 1,
                            }}
                        >
                            <Avatar
                                variant="rounded"
                                src={`${
                                    process.env.NX_PUBLIC_BASE_URL
                                }/api/jukebox/coverart/${
                                    currentPlaylist.id
                                }?type=${
                                    currentPlaylist.type
                                }&hash=${encodeURIComponent(
                                    currentPlaylist.name
                                )}`}
                            />
                            <Box sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle2" noWrap>
                                    {currentPlaylist.name}
                                </Typography>
                                {currentPlaylist.artist && (
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {currentPlaylist.artist}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ p: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Nothing playing yet
                            </Typography>
                        </Box>
                    )}

                    <JukeboxSongList
                        audioElemRef={audioElemRef}
                        currentPlaylist={currentPlaylist}
                        setCurrentSong={handleSelectSong}
                    />
                </Box>
            </Popover>
        </>
    );
};

export default JukeboxBrowse;
