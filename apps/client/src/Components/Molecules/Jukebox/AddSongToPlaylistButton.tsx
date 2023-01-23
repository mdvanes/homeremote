import { Star as StarIcon } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { FC, useState } from "react";
import { SongDirDialog } from "./SongDirDialog";

export const AddSongToPlaylistButton: FC = () => {
    const [openSongDir, setOpenSongDir] = useState(false);

    const handleClose = (value: string) => {
        setOpenSongDir(false);
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
            <SongDirDialog open={openSongDir} onClose={handleClose} />
        </>
    );
};
