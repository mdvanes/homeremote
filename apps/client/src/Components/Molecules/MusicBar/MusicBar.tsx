import { Paper, Stack } from "@mui/material";
import { FC } from "react";
import Jukebox from "../Jukebox/Jukebox";
import RadioChannelMenu from "../RadioPlayer/RadioChannelMenu";
import RadioEngine from "../RadioPlayer/RadioEngine";
import UrlToMusic from "../UrlToMusic/UrlToMusic";
import JukeboxProgressBar from "./JukeboxProgressBar";
import PlayerControls from "./PlayerControls";
import RadioHistoryButton from "./RadioHistoryButton";
import SourceArt from "./SourceArt";
import TrackInfo from "./TrackInfo";

// Reserve space at the bottom of the page so the fixed bar never covers content.
export const MUSIC_BAR_HEIGHT = 96;

/**
 * Persistent unified music player. Mounted once at the App level (outside the
 * router) so playback keeps running while navigating between pages. Shows a
 * single source image, the now-playing info and unified transport controls,
 * with the radio channel picker, jukebox browser and history tucked away in
 * popovers so the bar stays compact.
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
                // Needed so JukeboxProgressBar can anchor to the top edge.
                overflow: "hidden",
            }}
        >
            <JukeboxProgressBar />
            <Stack
                direction="row"
                spacing={1.5}
                sx={{ alignItems: "center", width: "100%" }}
            >
                <SourceArt />
                <TrackInfo />
                <PlayerControls />
                <Stack
                    direction="row"
                    sx={{ alignItems: "center", flexShrink: 0 }}
                >
                    <RadioChannelMenu />
                    <Jukebox />
                    <RadioHistoryButton />
                    <UrlToMusic />
                </Stack>
            </Stack>

            {/* Headless audio engine for the radio source. */}
            <RadioEngine />
        </Paper>
    );
};

export default MusicBar;
