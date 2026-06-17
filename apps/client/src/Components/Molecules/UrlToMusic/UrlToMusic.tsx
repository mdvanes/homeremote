import {
    Close as CloseIcon,
    MusicNote as MusicNoteIcon,
} from "@mui/icons-material";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import UrlToMusicForm from "./UrlToMusicForm";

const UrlToMusic: FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                data-testid="open-urltomusic"
                variant="outlined"
                startIcon={<MusicNoteIcon />}
                onClick={() => setOpen(true)}
            >
                URL to Music
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    URL to Music
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <UrlToMusicForm />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UrlToMusic;
