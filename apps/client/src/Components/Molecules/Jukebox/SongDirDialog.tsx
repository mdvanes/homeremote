import { SongDirItem } from "@homeremote/types";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
    Alert,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGetSongDirQuery } from "../../../Services/jukeboxApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import { SongDirSelectPlaylistDialog } from "./SongDirSelectPlaylistDialog";

interface SongDirDialogProps {
    open: boolean;
    onClose: (value: string) => void;
}

export const SongDirDialog: FC<SongDirDialogProps> = ({ open, onClose }) => {
    const dispatch = useDispatch();
    const { data, error } = useGetSongDirQuery(undefined);
    const [openPlaylist, setOpenPlaylist] = useState(false);
    const [selectedValue, setSelectedValue] = useState<SongDirItem>();

    const handleClose = () => {
        setOpenPlaylist(false);
    };

    const handleAddToPlaylist = (item: SongDirItem) => () => {
        setSelectedValue(item);
        setOpenPlaylist(true);
    };

    useEffect(() => {
        if (error) {
            dispatch(
                logError(
                    `AddSongToPlaylistButton failure: ${getErrorMessage(
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
                <DialogTitle>Songs in Dir</DialogTitle>

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
        <>
            <Dialog
                onClose={onClose}
                open={open}
                scroll="paper"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Songs in Dir "{data.dir.title}"</DialogTitle>

                <DialogContent>
                    <List>
                        {data.content.map((s) => (
                            <ListItem
                                key={s.title}
                                disableGutters
                                disablePadding
                                secondaryAction={
                                    <>
                                        <IconButton
                                            title="add to a playlist"
                                            onClick={handleAddToPlaylist(s)}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton title="play now">
                                            <PlayArrowIcon />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemButton
                                    onClick={handleAddToPlaylist(s)}
                                >
                                    <ListItemText
                                        primary={`${s.artist} - ${s.title}`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
            {selectedValue && (
                <SongDirSelectPlaylistDialog
                    selectedValue={selectedValue}
                    open={openPlaylist}
                    onClose={handleClose}
                />
            )}
        </>
    );
};
