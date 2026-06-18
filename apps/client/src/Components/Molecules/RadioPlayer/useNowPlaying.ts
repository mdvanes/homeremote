import { NowPlayingResponse } from "@homeremote/types";
import {
    useGetPinguinQuery,
    useGetRadio2Query,
    useGetRadio3Query,
    useGetSkyQuery,
} from "../../../Services/generated/nowplayingApi";
import { RadioChannelId } from "./channels";

// Poll the now-playing endpoint of the selected channel at this interval.
const NOW_PLAYING_POLL_MS = 60 * 1000;

interface UseNowPlayingResult {
    nowPlaying?: NowPlayingResponse;
    refetch: () => void;
}

/**
 * Returns the now-playing info for the selected radio channel. All channel
 * queries are declared (hooks must be unconditional) but only the selected
 * channel is fetched/polled; the rest are skipped.
 */
export const useNowPlaying = (
    channelId: RadioChannelId
): UseNowPlayingResult => {
    const radio2 = useGetRadio2Query(undefined, {
        skip: channelId !== "radio2",
        pollingInterval: NOW_PLAYING_POLL_MS,
    });
    const radio3 = useGetRadio3Query(undefined, {
        skip: channelId !== "radio3",
        pollingInterval: NOW_PLAYING_POLL_MS,
    });
    const sky = useGetSkyQuery(undefined, {
        skip: channelId !== "sky",
        pollingInterval: NOW_PLAYING_POLL_MS,
    });
    const pinguin = useGetPinguinQuery(undefined, {
        skip: channelId !== "pinguin",
        pollingInterval: NOW_PLAYING_POLL_MS,
    });

    const active =
        channelId === "radio2"
            ? radio2
            : channelId === "radio3"
              ? radio3
              : channelId === "sky"
                ? sky
                : pinguin;

    return { nowPlaying: active.data, refetch: active.refetch };
};
