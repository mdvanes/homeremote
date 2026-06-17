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
import { getLatestStartMs } from "./getLatestStartMs";

type HotKeyMap = Record<string, { description: string; fn: () => void }>;

export type MusicSource = "radio" | "jukebox";

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
    radioImageUrl: string;
    setRadioImageUrl: (_: string) => void;

    // Jukebox
    jukeboxElem: RefObject<HTMLAudioElement | null> | null;
    setJukeboxElem: (_: RefObject<HTMLAudioElement | null> | null) => void;
    isJukeboxPlaying: boolean;
    setIsJukeboxPlaying: (_: boolean) => void;
    jukeboxImageUrl: string;
    setJukeboxImageUrl: (_: string) => void;
    handlePlayPrev: () => void;
    setHandlePlayPrev: (_: () => void) => void;
    handlePlayNext: () => void;
    setHandlePlayNext: (_: () => void) => void;

    // Skip radio
    handleSkipRadio: () => void;
    isSkipRadioActive: boolean;

    // The source whose image should be shown as "now playing"
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
    radioImageUrl: "",
    setRadioImageUrl: noop,
    jukeboxElem: null,
    setJukeboxElem: noop,
    isJukeboxPlaying: false,
    setIsJukeboxPlaying: noop,
    jukeboxImageUrl: "",
    setJukeboxImageUrl: noop,
    handlePlayPrev: noop,
    setHandlePlayPrev: noop,
    handlePlayNext: noop,
    setHandlePlayNext: noop,
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
    const [radioImageUrl, setRadioImageUrl] = useState("");
    const [jukeboxImageUrl, setJukeboxImageUrl] = useState("");
    const [currentSource, setCurrentSource] = useState<MusicSource>("radio");
    const dispatch = useDispatch();

    // Track the source whose image should be displayed as "now playing".
    useEffect(() => {
        if (isRadioPlaying) {
            setCurrentSource("radio");
        } else if (isJukeboxPlaying) {
            setCurrentSource("jukebox");
        }
    }, [isRadioPlaying, isJukeboxPlaying]);

    // Subscribe to the radio metadata. It shares the RTK Query cache with
    // PreviouslyPlayedCard, and only polls while a skip is in progress.
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

    const toggleRadio = useCallback(() => {
        clearSkipRadio();
        if (isRadioPlaying) {
            pauseRadio();
        } else {
            playRadio();
        }
    }, [clearSkipRadio, isRadioPlaying, pauseRadio, playRadio]);

    const toggleJukebox = useCallback(() => {
        clearSkipRadio();
        const elem = jukeboxElem?.current;
        if (elem) {
            if (elem.paused) {
                elem.play();
            } else {
                elem.pause();
            }
        }
    }, [jukeboxElem, clearSkipRadio]);

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
            q: {
                description: "play/pause radio",
                fn: toggleRadio,
            },
            w: {
                description: "toggle between radio and jukebox",
                fn: toggleBetween,
            },
            a: {
                description: "play previous on jukebox",
                fn: handlePlayPrev,
            },
            s: {
                description: "play/pause jukebox",
                fn: toggleJukebox,
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
            toggleJukebox,
            toggleRadio,
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
        radioImageUrl,
        setRadioImageUrl,
        jukeboxElem,
        setJukeboxElem,
        isJukeboxPlaying,
        setIsJukeboxPlaying,
        jukeboxImageUrl,
        setJukeboxImageUrl,
        handlePlayPrev,
        setHandlePlayPrev,
        handlePlayNext,
        setHandlePlayNext,
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
