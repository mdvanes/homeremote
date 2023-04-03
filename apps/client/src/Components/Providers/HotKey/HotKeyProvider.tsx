import { Ports } from "@mdworld/homeremote-stream-player";
import React, {
    FC,
    ReactNode,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useDispatch } from "react-redux";
import { logUrgentInfo } from "../../Molecules/LogCard/logSlice";

type HotKeyMap = Record<string, { description: string; fn: () => void }>;

const getSkipMinutes = (): number => {
    const defaultSkipMinutes = 10;
    const storedSkipMinutes = localStorage.getItem("SKIP_MINUTES");
    if (!storedSkipMinutes) {
        return defaultSkipMinutes;
    }
    const nr = parseInt(storedSkipMinutes);
    if (isNaN(nr)) {
        return defaultSkipMinutes;
    }
    return nr;
};

const SKIP_MINUTES = getSkipMinutes();
const SKIP_TIME = SKIP_MINUTES * 60 * 1000;

export interface HotKeyState {
    hotKeyMap: HotKeyMap;
    isRadioPlaying: boolean;
    setIsRadioPlaying: (_: boolean) => void;
    ports: Ports | null;
    setPorts: (_: Ports | null) => void;
    jukeboxElem: RefObject<HTMLAudioElement> | null;
    setJukeboxElem: (_: RefObject<HTMLAudioElement> | null) => void;
    handlePlayPrev: () => void;
    setHandlePlayPrev: (_: () => void) => void;
    handlePlayNext: () => void;
    setHandlePlayNext: (_: () => void) => void;
    handleSkipRadio: () => void;
    isSkipRadioActive: boolean;
}

const noop = () => {
    /* */
};

const initialState: HotKeyState = {
    hotKeyMap: {},
    isRadioPlaying: false,
    setIsRadioPlaying: noop,
    ports: null,
    setPorts: noop,
    jukeboxElem: null,
    setJukeboxElem: noop,
    handlePlayPrev: noop,
    setHandlePlayPrev: noop,
    handlePlayNext: noop,
    setHandlePlayNext: noop,
    handleSkipRadio: noop,
    isSkipRadioActive: false,
};

export const HotKeyContext = React.createContext(initialState);

export const useHotKeyContext = () => useContext(HotKeyContext);

let skipRadioTimer: ReturnType<typeof setTimeout> | undefined;

// NOTE: using Context API because ports and jukeboxElemRef are not serializable and can't be stored in Redux
export const HotKeyProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isRadioPlaying, setIsRadioPlaying] = useState(false);
    const [ports, setPorts] = useState<Ports | null>(null);
    const [jukeboxElem, setJukeboxElem] =
        useState<RefObject<HTMLAudioElement> | null>(null);
    const [handlePlayPrev, setHandlePlayPrev] = useState(() => noop);
    const [handlePlayNext, setHandlePlayNext] = useState(() => noop);
    const [isSkipRadioActive, setIsSkipRadioActive] = useState(false);
    const dispatch = useDispatch();

    const clearSkipRadio = useCallback(
        (finished = false) => {
            if (skipRadioTimer) {
                clearTimeout(skipRadioTimer);
                skipRadioTimer = undefined;
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
        [dispatch]
    );

    const toggleRadio = useCallback(() => {
        clearSkipRadio();
        if (ports?.receivePlayPauseStatusPort?.send) {
            ports.receivePlayPauseStatusPort.send(
                isRadioPlaying ? "Pause" : "Play"
            );
        }
    }, [ports, isRadioPlaying, clearSkipRadio]);

    const toggleJukebox = useCallback(() => {
        clearSkipRadio();
        if (jukeboxElem?.current) {
            if (jukeboxElem.current.paused) {
                jukeboxElem.current.play();
            } else {
                jukeboxElem.current.pause();
            }
        }
    }, [jukeboxElem, clearSkipRadio]);

    const toggleBetween = useCallback(() => {
        clearSkipRadio();
        if (ports?.receivePlayPauseStatusPort?.send) {
            ports.receivePlayPauseStatusPort.send(
                isRadioPlaying ? "Pause" : "Play"
            );
        }
        if (jukeboxElem?.current) {
            if (isRadioPlaying) {
                jukeboxElem.current.play();
            } else {
                jukeboxElem.current.pause();
            }
        }
    }, [ports, isRadioPlaying, jukeboxElem, clearSkipRadio]);

    const handleSkipRadio = useCallback(() => {
        if (isRadioPlaying) {
            clearSkipRadio();
            setIsSkipRadioActive(true);

            if (ports?.receivePlayPauseStatusPort?.send) {
                ports.receivePlayPauseStatusPort.send("Pause");
            }
            if (jukeboxElem?.current) {
                jukeboxElem.current.play();
            }

            const resumeTimeString = new Date(
                Date.now() + SKIP_TIME
            ).toLocaleTimeString();

            dispatch(logUrgentInfo(`Radio will resume at ${resumeTimeString}`));

            skipRadioTimer = setTimeout(() => {
                clearSkipRadio(true);
                setIsSkipRadioActive(false);
                if (jukeboxElem?.current) {
                    jukeboxElem.current.pause();
                }
                if (ports?.receivePlayPauseStatusPort?.send) {
                    ports.receivePlayPauseStatusPort.send("Play");
                }
            }, SKIP_TIME);
        }
    }, [ports, isRadioPlaying, jukeboxElem, dispatch, clearSkipRadio]);

    const hotKeyMap: Record<string, { description: string; fn: () => void }> =
        useMemo(
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
                    description: `skip radio ${SKIP_MINUTES} minutes`,
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
        isRadioPlaying,
        setIsRadioPlaying,
        ports,
        setPorts,
        jukeboxElem,
        setJukeboxElem,
        handlePlayPrev,
        setHandlePlayPrev,
        handlePlayNext,
        setHandlePlayNext,
        handleSkipRadio,
        isSkipRadioActive,
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

    useEffect(() => {
        const subscribe = ports?.setPlayPauseStatusPort?.subscribe;
        if (subscribe) {
            subscribe((newStatus) => {
                setIsRadioPlaying(newStatus === "Play" ? true : false);
            });
        }
    }, [ports]);

    return (
        <HotKeyContext.Provider value={state}>
            {children}
        </HotKeyContext.Provider>
    );
};

export default HotKeyProvider;
