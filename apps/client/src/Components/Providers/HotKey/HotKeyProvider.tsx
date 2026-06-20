import { PreviouslyResponse } from "@homeremote/types";
import React, {
    FC,
    ReactNode,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { useGetRadio2PreviouslyQuery } from "../../../Services/generated/nowplayingApi";
import { logUrgentInfo } from "../../Molecules/LogCard/logSlice";
import {
    getInitialChannelId,
    LAST_RADIO_CHANNEL,
    RadioChannelId,
} from "../../Molecules/RadioPlayer/channels";
import { getLatestStartMs } from "./getLatestStartMs";

type HotKeyMap = Record<string, { description: string; fn: () => void }>;

export type MusicSource = "radio" | "jukebox";

// What is shown in the unified player for a given source.
export interface NowPlayingInfo {
    title: string;
    artist: string;
    album: string;
    imageUrl: string;
    /** Track duration in seconds, from the API. */
    duration: number;
}

const emptyNowPlayingInfo: NowPlayingInfo = {
    title: "",
    artist: "",
    album: "",
    imageUrl: "",
    duration: 0,
};

const getFallbackMinutes = (): number => {
    const defaultFallbackMinutes = 20;
    const stored = localStorage.getItem("SKIP_FALLBACK_MINUTES");
    if (!stored) {
        return defaultFallbackMinutes;
    }
    const nr = parseInt(stored, 10);
    if (isNaN(nr)) {
        return defaultFallbackMinutes;
    }
    return nr;
};

// When skipping the radio, fall back to resuming after this many minutes if no
// new radio metadata (a new song) is detected.
const SKIP_FALLBACK_MINUTES = getFallbackMinutes();
const SKIP_FALLBACK_MS = SKIP_FALLBACK_MINUTES * 60 * 1000;

// While a skip is active, poll the radio metadata at this interval to detect a new song.
const SKIP_POLL_MS = 30 * 1000;

export interface HotKeyState {
    hotKeyMap: HotKeyMap;

    // Radio
    radioElem: RefObject<HTMLAudioElement | null> | null;
    setRadioElem: (_: RefObject<HTMLAudioElement | null> | null) => void;
    isRadioPlaying: boolean;
    setIsRadioPlaying: (_: boolean) => void;
    playRadio: () => void;
    setPlayRadio: (_: () => void) => void;
    radioInfo: NowPlayingInfo;
    setRadioInfo: (_: NowPlayingInfo) => void;
    radioChannelId: RadioChannelId;
    setRadioChannelId: (_: RadioChannelId) => void;

    // Jukebox
    jukeboxElem: RefObject<HTMLAudioElement | null> | null;
    setJukeboxElem: (_: RefObject<HTMLAudioElement | null> | null) => void;
    isJukeboxPlaying: boolean;
    setIsJukeboxPlaying: (_: boolean) => void;
    jukeboxInfo: NowPlayingInfo;
    setJukeboxInfo: (_: NowPlayingInfo) => void;
    handlePlayPrev: () => void;
    setHandlePlayPrev: (_: () => void) => void;
    handlePlayNext: () => void;
    setHandlePlayNext: (_: () => void) => void;

    // Unified playback
    isPlaying: boolean;
    togglePlayPause: () => void;

    // Skip radio
    handleSkipRadio: () => void;
    isSkipRadioActive: boolean;

    // The source whose info should be shown as "now playing"
    currentSource: MusicSource;
}

const noop = () => {
    /* */
};

const initialState: HotKeyState = {
    hotKeyMap: {},
    radioElem: null,
    setRadioElem: noop,
    isRadioPlaying: false,
    setIsRadioPlaying: noop,
    playRadio: noop,
    setPlayRadio: noop,
    radioInfo: emptyNowPlayingInfo,
    setRadioInfo: noop,
    radioChannelId: getInitialChannelId(),
    setRadioChannelId: noop,
    jukeboxElem: null,
    setJukeboxElem: noop,
    isJukeboxPlaying: false,
    setIsJukeboxPlaying: noop,
    jukeboxInfo: emptyNowPlayingInfo,
    setJukeboxInfo: noop,
    handlePlayPrev: noop,
    setHandlePlayPrev: noop,
    handlePlayNext: noop,
    setHandlePlayNext: noop,
    isPlaying: false,
    togglePlayPause: noop,
    handleSkipRadio: noop,
    isSkipRadioActive: false,
    currentSource: "radio",
};

export const HotKeyContext = React.createContext(initialState);

export const useHotKeyContext = () => useContext(HotKeyContext);

let skipRadioTimer: ReturnType<typeof setTimeout> | undefined;

// NOTE: using Context API because the audio element refs are not serializable
// and can't be stored in Redux.
export const HotKeyProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isRadioPlaying, setIsRadioPlaying] = useState(false);
    const [isJukeboxPlaying, setIsJukeboxPlaying] = useState(false);
    const [radioElem, setRadioElem] =
        useState<RefObject<HTMLAudioElement | null> | null>(null);
    const [jukeboxElem, setJukeboxElem] =
        useState<RefObject<HTMLAudioElement | null> | null>(null);
    const [playRadio, setPlayRadio] = useState(() => noop);
    const [handlePlayPrev, setHandlePlayPrev] = useState(() => noop);
    const [handlePlayNext, setHandlePlayNext] = useState(() => noop);
    const [isSkipRadioActive, setIsSkipRadioActive] = useState(false);
    const [radioInfo, setRadioInfo] =
        useState<NowPlayingInfo>(emptyNowPlayingInfo);
    const [jukeboxInfo, setJukeboxInfo] =
        useState<NowPlayingInfo>(emptyNowPlayingInfo);
    const [radioChannelId, setRadioChannelIdState] =
        useState<RadioChannelId>(getInitialChannelId);
    const [currentSource, setCurrentSource] = useState<MusicSource>("radio");
    const dispatch = useDispatch();

    const setRadioChannelId = useCallback((id: RadioChannelId) => {
        localStorage.setItem(LAST_RADIO_CHANNEL, id);
        setRadioChannelIdState(id);
    }, []);

    // Track the source whose image should be displayed as "now playing".
    useEffect(() => {
        if (isRadioPlaying) {
            setCurrentSource("radio");
        } else if (isJukeboxPlaying) {
            setCurrentSource("jukebox");
        }
    }, [isRadioPlaying, isJukeboxPlaying]);

    // Subscribe to the radio metadata. It shares the RTK Query cache with
    // RadioHistoryButton, and only polls while a skip is in progress.
    const { data: previouslyData } = useGetRadio2PreviouslyQuery(undefined, {
        pollingInterval: isSkipRadioActive ? SKIP_POLL_MS : 0,
    });
    const previouslyDataRef = useRef<PreviouslyResponse[] | undefined>(
        undefined
    );
    previouslyDataRef.current = previouslyData;
    // The newest song-start timestamp captured when the skip started.
    const skipBaselineRef = useRef<number | null>(null);

    const pauseRadio = useCallback(() => {
        radioElem?.current?.pause();
    }, [radioElem]);

    const pauseJukebox = useCallback(() => {
        jukeboxElem?.current?.pause();
    }, [jukeboxElem]);

    const playJukebox = useCallback(() => {
        jukeboxElem?.current?.play();
    }, [jukeboxElem]);

    const clearSkipRadio = useCallback(
        (finished = false) => {
            if (skipRadioTimer) {
                clearTimeout(skipRadioTimer);
                skipRadioTimer = undefined;
            }
            skipBaselineRef.current = null;
            if (isSkipRadioActive) {
                setIsSkipRadioActive(false);
                dispatch(
                    logUrgentInfo(
                        finished
                            ? "Skip radio finished"
                            : "Skip radio cancelled"
                    )
                );
            }
        },
        [dispatch, isSkipRadioActive]
    );

    const resumeRadioAfterSkip = useCallback(() => {
        clearSkipRadio(true);
        pauseJukebox();
        playRadio();
    }, [clearSkipRadio, pauseJukebox, playRadio]);


    // Unified play/pause: pauses whichever source is playing, otherwise resumes
    // the source that was last active (the one shown in the bar).
    const isPlaying = isRadioPlaying || isJukeboxPlaying;

    const togglePlayPause = useCallback(() => {
        clearSkipRadio();
        if (isRadioPlaying) {
            pauseRadio();
        } else if (isJukeboxPlaying) {
            pauseJukebox();
        } else if (currentSource === "jukebox") {
            playJukebox();
        } else {
            playRadio();
        }
    }, [
        clearSkipRadio,
        isRadioPlaying,
        isJukeboxPlaying,
        currentSource,
        pauseRadio,
        pauseJukebox,
        playJukebox,
        playRadio,
    ]);

    const toggleBetween = useCallback(() => {
        clearSkipRadio();
        if (isRadioPlaying) {
            pauseRadio();
            playJukebox();
        } else {
            pauseJukebox();
            playRadio();
        }
    }, [
        isRadioPlaying,
        pauseRadio,
        playRadio,
        pauseJukebox,
        playJukebox,
        clearSkipRadio,
    ]);

    const handleSkipRadio = useCallback(() => {
        if (!isRadioPlaying || isSkipRadioActive) {
            return;
        }

        skipBaselineRef.current = getLatestStartMs(previouslyDataRef.current);
        setIsSkipRadioActive(true);

        pauseRadio();
        playJukebox();

        const fallbackTimeString = new Date(
            Date.now() + SKIP_FALLBACK_MS
        ).toLocaleTimeString();
        dispatch(
            logUrgentInfo(
                `Skip radio: playing jukebox until a new radio song starts (or ${fallbackTimeString})`
            )
        );

        skipRadioTimer = setTimeout(() => {
            resumeRadioAfterSkip();
        }, SKIP_FALLBACK_MS);
    }, [
        isRadioPlaying,
        isSkipRadioActive,
        pauseRadio,
        playJukebox,
        dispatch,
        resumeRadioAfterSkip,
    ]);

    // While skipping, resume the radio as soon as a newer song-start timestamp
    // appears in the metadata (a new song has started).
    useEffect(() => {
        if (!isSkipRadioActive) {
            return;
        }
        const latest = getLatestStartMs(previouslyData);
        if (
            latest !== null &&
            skipBaselineRef.current !== null &&
            latest > skipBaselineRef.current
        ) {
            resumeRadioAfterSkip();
        }
    }, [isSkipRadioActive, previouslyData, resumeRadioAfterSkip]);

    const hotKeyMap: HotKeyMap = useMemo(
        () => ({
            s: {
                description: "play/pause current source (radio or jukebox)",
                fn: togglePlayPause,
            },
            w: {
                description: "toggle between radio and jukebox",
                fn: toggleBetween,
            },
            a: {
                description: "play previous on jukebox",
                fn: handlePlayPrev,
            },
            d: {
                description: "play next on jukebox",
                fn: handlePlayNext,
            },
            f: {
                description: `skip radio until the next song (max ${SKIP_FALLBACK_MINUTES} min)`,
                fn: handleSkipRadio,
            },
        }),
        [
            handlePlayNext,
            handlePlayPrev,
            toggleBetween,
            togglePlayPause,
            handleSkipRadio,
        ]
    );

    const state: HotKeyState = {
        hotKeyMap,
        radioElem,
        setRadioElem,
        isRadioPlaying,
        setIsRadioPlaying,
        playRadio,
        setPlayRadio,
        radioInfo,
        setRadioInfo,
        radioChannelId,
        setRadioChannelId,
        jukeboxElem,
        setJukeboxElem,
        isJukeboxPlaying,
        setIsJukeboxPlaying,
        jukeboxInfo,
        setJukeboxInfo,
        handlePlayPrev,
        setHandlePlayPrev,
        handlePlayNext,
        setHandlePlayNext,
        isPlaying,
        togglePlayPause,
        handleSkipRadio,
        isSkipRadioActive,
        currentSource,
    };

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // Do not intercept keypress from input elements, e.g. in forms
            if ((event.target as HTMLElement).tagName === "INPUT") {
                return;
            }

            const hotKeyAction = hotKeyMap[event.key];
            if (hotKeyAction) {
                hotKeyAction.fn();
            }
        },
        [hotKeyMap]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);

        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <HotKeyContext.Provider value={state}>
            {children}
        </HotKeyContext.Provider>
    );
};

export default HotKeyProvider;
