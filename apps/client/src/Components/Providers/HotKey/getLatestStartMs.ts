import { PreviouslyResponse } from "@homeremote/types";

/**
 * Returns the newest "song start" timestamp (in ms) across the previously-played
 * tracks, or null when none is available. Used to detect that a new song has
 * started on the radio.
 *
 * NOTE: do not use `last_updated` for this — it is regenerated on every fetch and
 * therefore always increases, which makes it useless as a "new song" signal. The
 * track `time.start` only changes when a new song actually starts.
 */
export const getLatestStartMs = (
    data?: PreviouslyResponse[]
): number | null => {
    if (!data || data.length === 0) {
        return null;
    }
    const times = data
        .map((track) => track.time?.start)
        .filter((start): start is string => Boolean(start))
        .map((start) => Date.parse(start))
        .filter((ms) => !isNaN(ms));
    if (times.length === 0) {
        return null;
    }
    return Math.max(...times);
};
