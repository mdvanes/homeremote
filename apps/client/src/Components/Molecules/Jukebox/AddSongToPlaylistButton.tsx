import { useGetSongDirQuery } from "../../../Services/jukeboxApi";
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
import { SongDirSelectPlaylistDialog } from "./SongDirSelectPlaylistDialog";
import { Star as StarIcon } from "@mui/icons-material";
import { PlayArrow as PlayArrowIcon } from "@mui/icons-material";

export const AddSongToPlaylistButton: FC = () => {
    const { data } = useGetSongDirQuery(undefined);
    console.log(data);
    const [openSongDir, setOpenSongDir] = useState(false);
    const [openPlaylist, setOpenPlaylist] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");

    const handleClickOpen = () => {
        setOpenPlaylist(true);
    };

    const handleClose = (value: string) => {
        setOpenSongDir(false);
    };

    const handleClose1 = (value: string) => {
        setOpenPlaylist(false);
        setSelectedValue(value);
    };

    if (!data || data?.status === "error") {
        // TODO improve error handling
        return <>error</>;
    }

    const blehRender = () => {
        return (
            <Card style={{ marginTop: 10 }}>
                <CardHeader title={`Songs Dir "${data.dir.title}"`} />
                {/* <Typography variant="h1"></Typography> */}
                <List component={Paper}>
                    {data.content.map((s) => (
                        <ListItem
                            key={s.title}
                            disableGutters
                            disablePadding
                            secondaryAction={
                                <>
                                    <IconButton title="add to a playlist">
                                        <AddIcon />
                                    </IconButton>
                                    <IconButton title="play now">
                                        <PlayArrowIcon />
                                    </IconButton>
                                </>
                            }
                        >
                            <ListItemButton
                                onClick={() => {
                                    // TODO set selected song
                                    setOpenPlaylist(true);
                                }}
                            >
                                <ListItemText
                                    primary={`${s.artist} - ${s.title}`}
                                />
                            </ListItemButton>
                            {/* <li key={s.title}>
                    {s.title}{" "}
                    <IconButton title="add to a playlist">
                        <AddIcon />
                    </IconButton>
                </li> */}
                        </ListItem>
                    ))}
                </List>
                <SongDirSelectPlaylistDialog
                    selectedValue={selectedValue}
                    open={openPlaylist}
                    onClose={handleClose1}
                />
            </Card>
        );
    };

    return (
        <>
            <IconButton
                onClick={() => {
                    setOpenSongDir(true);
                }}
            >
                <StarIcon />
            </IconButton>
            <Dialog
                onClose={handleClose}
                open={openSongDir}
                scroll="paper"
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Select song</DialogTitle>
                <DialogTitle>
                    <Typography>to which ??? will be added</Typography>
                </DialogTitle>
                <DialogContent>{blehRender()}</DialogContent>
            </Dialog>
        </>
    );
};
