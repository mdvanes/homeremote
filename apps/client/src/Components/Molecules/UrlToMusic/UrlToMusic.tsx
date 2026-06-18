import {
    Close as CloseIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { FC, useState } from "react";
import UrlToMusicForm from "./UrlToMusicForm";

const UrlToMusic: FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <IconButton
                aria-label="URL to Music"
                data-testid="open-urltomusic"
                onClick={() => setOpen(true)}
            >
                <DownloadIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="md"
                scroll="paper"
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
                <DialogContent dividers sx={{ minHeight: 360 }}>
                    <UrlToMusicForm />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UrlToMusic;
