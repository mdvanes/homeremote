import { LinearProgress } from "@mui/material";
import { FC } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { useJukeboxPlaybackTime } from "./useJukeboxPlaybackTime";

/**
 * Thin progress bar rendered as the top border of the MusicBar Paper while the
 * jukebox is actively playing.
 */
const JukeboxProgressBar: FC = () => {
    const { currentSource } = useHotKeyContext();
    const { progress } = useJukeboxPlaybackTime();

    if (currentSource !== "jukebox") {
        return null;
    }

    return (
        <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                borderRadius: 0,
            }}
        />
    );
};

export default JukeboxProgressBar;
