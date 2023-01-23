import {
    useGetPlaylistsQuery,
    useGetSongDirQuery,
} from "../../../Services/jukeboxApi";
import { FC, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface SongDirSelectPlaylistDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

export function SongDirSelectPlaylistDialog(
    props: SongDirSelectPlaylistDialogProps
) {
    const { data } = useGetPlaylistsQuery(undefined);

    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const handleListItemClick = (value: string) => {
        onClose(value);
    };

    if (!data || data.status === "error") {
        return <>error</>; // TODO
    }

    return (
        <Dialog onClose={handleClose} open={open} scroll="paper">
            <DialogTitle>Select playlist</DialogTitle>
            <DialogTitle>
                <Typography>to which ??? will be added</Typography>
            </DialogTitle>
            <DialogContent>
                <List sx={{ pt: 0 }}>
                    {data.playlists.map((playlist) => (
                        <ListItem disableGutters>
                            <ListItemButton
                                // onClick={() => handleListItemClick(email)}
                                key={playlist.id}
                            >
                                {/* <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: blue[100],
                                        color: blue[600],
                                    }}
                                >
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar> */}
                                <ListItemText primary={playlist.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                    {/* {emails.map((email) => (
                    <ListItem disableGutters>
                        <ListItemButton
                            onClick={() => handleListItemClick(email)}
                            key={email}
                        >
                            <ListItemAvatar>
                                <Avatar
                                    sx={{
                                        bgcolor: blue[100],
                                        color: blue[600],
                                    }}
                                >
                                    <PersonIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={email} />
                        </ListItemButton>
                    </ListItem>
                ))} */}
                    {/* <ListItem disableGutters>
                    <ListItemButton
                        autoFocus
                        onClick={() => handleListItemClick("addAccount")}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <AddIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary="Add account" />
                    </ListItemButton>
                </ListItem> */}
                </List>
            </DialogContent>
        </Dialog>
    );
}
