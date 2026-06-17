import {
    LibraryMusic as LibraryMusicIcon,
    Radio as RadioIcon,
} from "@mui/icons-material";
import { Avatar, Box, Typography } from "@mui/material";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

// Shows an image for the source that is currently playing (radio or jukebox).
const NowPlayingSourceImage: FC = () => {
    const { currentSource, radioImageUrl, jukeboxImageUrl } =
        useHotKeyContext();
    const isRadio = currentSource === "radio";
    const imageUrl = isRadio ? radioImageUrl : jukeboxImageUrl;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <Avatar
                variant="rounded"
                src={imageUrl}
                alt={isRadio ? "Radio" : "Jukebox"}
                sx={{ width: 56, height: 56 }}
            >
                {isRadio ? <RadioIcon /> : <LibraryMusicIcon />}
            </Avatar>
            <Typography variant="caption" color="text.secondary">
                {isRadio ? "Radio" : "Jukebox"}
            </Typography>
        </Box>
    );
};

export default NowPlayingSourceImage;
