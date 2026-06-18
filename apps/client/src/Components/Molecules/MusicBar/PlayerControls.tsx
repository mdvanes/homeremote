import {
    FastForward as FastForwardIcon,
    FastRewind as FastRewindIcon,
    Forward10 as Forward10Icon,
    Pause as PauseIcon,
    PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import HotKeyCoach from "../Jukebox/HotKeyCoach";

/**
 * Unified transport controls. A single play/pause button drives whichever source
 * is active. Previous/next are only shown for the jukebox; the skip-radio and
 * hotkey-coach buttons are always shown.
 */
const PlayerControls: FC = () => {
    const {
        isPlaying,
        togglePlayPause,
        currentSource,
        handlePlayPrev,
        handlePlayNext,
        handleSkipRadio,
        isSkipRadioActive,
    } = useHotKeyContext();

    const isJukebox = currentSource === "jukebox";

    return (
        <Stack direction="row" sx={{ alignItems: "center", flexShrink: 0 }}>
            {isJukebox && (
                <Tooltip title="Previous track (a)">
                    <IconButton
                        aria-label="Previous track"
                        onClick={handlePlayPrev}
                    >
                        <FastRewindIcon />
                    </IconButton>
                </Tooltip>
            )}

            <Tooltip title={isPlaying ? "Pause" : "Play"}>
                <IconButton
                    aria-label={isPlaying ? "Pause" : "Play"}
                    color="primary"
                    size="large"
                    onClick={togglePlayPause}
                >
                    {isPlaying ? (
                        <PauseIcon fontSize="large" />
                    ) : (
                        <PlayArrowIcon fontSize="large" />
                    )}
                </IconButton>
            </Tooltip>

            {isJukebox && (
                <Tooltip title="Next track (d)">
                    <IconButton
                        aria-label="Next track"
                        onClick={handlePlayNext}
                    >
                        <FastForwardIcon />
                    </IconButton>
                </Tooltip>
            )}

            {isSkipRadioActive ? (
                <Tooltip title="Skip radio in progress!">
                    <IconButton aria-label="Skip radio in progress">
                        <Forward10Icon color="secondary" />
                    </IconButton>
                </Tooltip>
            ) : (
                <Tooltip title="Skip radio until the next song (f)">
                    <IconButton
                        aria-label="Skip radio until the next song"
                        onClick={handleSkipRadio}
                    >
                        <Forward10Icon />
                    </IconButton>
                </Tooltip>
            )}

            <HotKeyCoach />
        </Stack>
    );
};

export default PlayerControls;
