import { useEffect, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

export interface JukeboxPlaybackTime {
    currentTime: number;
    duration: number;
    /** 0–100, ready for use in LinearProgress */
    progress: number;
}

export const formatPlaybackTime = (seconds: number): string => {
    if (!isFinite(seconds) || isNaN(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
};

/**
 * Polls the jukebox audio element every 500 ms while playing and returns the
 * current playback position, total duration, and progress percentage.
 */
export const useJukeboxPlaybackTime = (): JukeboxPlaybackTime => {
    const { jukeboxElem, isJukeboxPlaying } = useHotKeyContext();
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const elem = jukeboxElem?.current;
        if (!elem) return;

        const read = () => {
            setCurrentTime(elem.currentTime);
            setDuration(isNaN(elem.duration) ? 0 : elem.duration);
        };

        // Always do an immediate read (e.g. when pausing, capture final position).
        read();

        if (!isJukeboxPlaying) return;

        const id = setInterval(read, 500);
        return () => clearInterval(id);
    }, [isJukeboxPlaying, jukeboxElem]);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return { currentTime, duration, progress };
};
