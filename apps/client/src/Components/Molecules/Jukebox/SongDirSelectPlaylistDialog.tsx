import { IPlaylist, SongDirItem } from "@homeremote/types";
import {
    Alert,
    Dialog,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
    useAddSongToPlaylistMutation,
    useGetPlaylistsQuery,
} from "../../../Services/jukeboxApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError, logUrgentInfo } from "../LogCard/logSlice";

interface SongDirSelectPlaylistDialogProps {
    open: boolean;
    selectedValue: SongDirItem;
    onClose: () => void;
}

export function SongDirSelectPlaylistDialog(
    props: SongDirSelectPlaylistDialogProps
) {
    const dispatch = useDispatch();
    const { onClose, selectedValue, open } = props;
    const { data, error } = useGetPlaylistsQuery(undefined);
    const [addSongToPlaylist] = useAddSongToPlaylistMutation();

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = async (playlist: IPlaylist) => {
        try {
            const response = await addSongToPlaylist({
                playlistId: playlist.id,
                songId: selectedValue.id,
            }).unwrap();
            if (response.status !== "received") {
                throw Error("Error on adding song to playlist");
            }
            dispatch(
                logUrgentInfo(
                    `Song "${selectedValue.artist} - ${selectedValue.title}" added to playlist "${playlist.name}"`
                )
            );
        } catch (err) {
            dispatch(
                logError(
                    `SongDirSelectPlaylistDialog failure: ${getErrorMessage(
                        err as Error
                    ).toString()}`
                )
            );
        }
        onClose();
    };

    useEffect(() => {
        if (error) {
            dispatch(
                logError(
                    `SongDirSelectPlaylistDialog failure: ${getErrorMessage(
                        error
                    ).toString()}`
                )
            );
        }
    }, [dispatch, error]);

    if (error || !data || data?.status === "error") {
        return (
            <Dialog
                onClose={onClose}
                open={open}
                scroll="paper"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Select playlist</DialogTitle>

                <DialogContent>
                    {error ? (
                        <Alert severity="error">{getErrorMessage(error)}</Alert>
                    ) : (
                        "No content"
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
            scroll="paper"
            maxWidth="md"
            fullWidth
        >
            <DialogTitle>Select playlist</DialogTitle>
            <DialogTitle>
                <Typography>
                    to which "{selectedValue.artist} - {selectedValue.title}"
                    will be added:
                </Typography>
            </DialogTitle>
            <DialogContent>
                <List sx={{ pt: 0 }}>
                    {data.playlists.map((playlist) => (
                        <ListItem disableGutters key={playlist.id}>
                            <ListItemButton
                                onClick={() => handleListItemClick(playlist)}
                                key={playlist.id}
                            >
                                <ListItemText primary={playlist.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
}
