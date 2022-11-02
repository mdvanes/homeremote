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

type HotKeyMap = Record<string, { description: string; fn: () => void }>;

export interface HotKeyState {
    hotKeyMap: HotKeyMap;
    isRadioPlaying: boolean;
    setIsRadioPlaying: (_: boolean) => void;
    ports: Ports | null;
    setPorts: (_: Ports | null) => void;
    jukeboxElem: RefObject<HTMLAudioElement> | null;
    setJukeboxElem: (_: RefObject<HTMLAudioElement> | null) => void;
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
};

export const HotKeyContext = React.createContext(initialState);

export const useHotKeyContext = () => useContext(HotKeyContext);

// NOTE: using Context API because ports and jukeboxElemRef are not serializable and can't be stored in Redux
export const HotKeyProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isRadioPlaying, setIsRadioPlaying] = useState(false);
    const [ports, setPorts] = useState<Ports | null>(null);
    const [jukeboxElem, setJukeboxElem] =
        useState<RefObject<HTMLAudioElement> | null>(null);

    const toggleRadio = useCallback(() => {
        if (ports?.receivePlayPauseStatusPort?.send) {
            ports.receivePlayPauseStatusPort.send(
                isRadioPlaying ? "Pause" : "Play"
            );
        }
    }, [ports, isRadioPlaying]);

    const toggleJukebox = useCallback(() => {
        if (jukeboxElem?.current) {
            if (jukeboxElem.current.paused) {
                jukeboxElem.current.play();
            } else {
                jukeboxElem.current.pause();
            }
        }
    }, [jukeboxElem]);

    const toggleBetween = useCallback(() => {
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
    }, [ports, isRadioPlaying, jukeboxElem]);

    const hotKeyMap: Record<string, { description: string; fn: () => void }> =
        useMemo(
            () => ({
                p: {
                    description: "play/pause radio",
                    fn: toggleRadio,
                },
                j: {
                    description: "play/pause jukebox",
                    fn: toggleJukebox,
                },
                t: {
                    description: "toggle between radio and jukebox",
                    fn: toggleBetween,
                },
            }),
            [toggleBetween, toggleJukebox, toggleRadio]
        );

    const state: HotKeyState = {
        hotKeyMap,
        isRadioPlaying,
        setIsRadioPlaying,
        ports,
        setPorts,
        jukeboxElem,
        setJukeboxElem,
    };

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
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
