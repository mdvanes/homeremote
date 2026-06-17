import { Box, Divider, Paper, Stack } from "@mui/material";
import { FC } from "react";
import Jukebox from "../Jukebox/Jukebox";
import PreviouslyPlayedCard from "../PreviouslyPlayedCard/PreviouslyPlayedCard";
import RadioPlayer from "../RadioPlayer/RadioPlayer";
import NowPlayingSourceImage from "./NowPlayingSourceImage";

// Reserve space at the bottom of the page so the fixed bar never covers content.
export const MUSIC_BAR_HEIGHT = 180;

/**
 * Persistent bottom bar that hosts the radio player, the jukebox and the
 * previously-played list. It is mounted once at the App level (outside the
 * router) so playback keeps running while navigating between pages.
 */
const MusicBar: FC = () => {
    return (
        <Paper
            elevation={8}
            square
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: (theme) => theme.zIndex.appBar,
                px: 2,
                py: 1,
            }}
        >
            <PreviouslyPlayedCard />
            <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ alignItems: "center" }}
            >
                <NowPlayingSourceImage />
                <RadioPlayer />
                <Divider
                    orientation="vertical"
                    flexItem
                    sx={{ display: { xs: "none", md: "block" } }}
                />
                <Box sx={{ flexGrow: 1, minWidth: 0, width: "100%" }}>
                    <Jukebox />
                </Box>
            </Stack>
        </Paper>
    );
};

export default MusicBar;
