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
import { useGetPlaylistsQuery } from "../../../Services/jukeboxApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";

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

    const handleClose = () => {
        onClose();
    };

    const handleListItemClick = (playlist: IPlaylist) => {
        console.log(selectedValue, playlist);
        // TODO call api
        // TODO toast error/success
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
                        <ListItem disableGutters>
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
