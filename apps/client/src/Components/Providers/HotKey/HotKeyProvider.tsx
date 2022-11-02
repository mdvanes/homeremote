import { Ports } from "@mdworld/homeremote-stream-player";
import React, {
    FC,
    ReactNode,
    RefObject,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export interface HotKeyState {
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
    isRadioPlaying: false,
    setIsRadioPlaying: noop,
    ports: null,
    setPorts: noop,
    jukeboxElem: null,
    setJukeboxElem: noop,
};

export const HotKeyContext = React.createContext(initialState);

export const useHotKeyContext = () => useContext(HotKeyContext);

// const useHotKeyListeners = () => {
//     const x = useHotKeyContext();
//     // const toggleRadio = useCallback(() => {
//     //     if (ports?.receivePlayPauseStatusPort?.send) {
//     //         ports.receivePlayPauseStatusPort.send(
//     //             isRadioPlaying ? "Pause" : "Play"
//     //         );
//     //     }
//     // }, [ports, isRadioPlaying]);
//     const toggleRadio = useCallback(() => {
//         console.log(x);
//         const { ports } = x;
//         if (ports?.receivePlayPauseStatusPort?.send) {
//             ports.receivePlayPauseStatusPort.send("Play");
//         }
//     }, [x]);
//     return <button onClick={() => toggleRadio()}>test</button>;
// };

// TODO remove
// export const HotKeyProvider2: FC = () => {
//     const btn = useHotKeyListeners();
//     return <div>{btn}</div>;
// };

// NOTE: using Context API because ports and jukeboxElemRef are not serializable and can't be stored in Redux
export const HotKeyProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [isRadioPlaying, setIsRadioPlaying] = useState(false);
    const [ports, setPorts] = useState<Ports | null>(null);
    const [jukeboxElem, setJukeboxElem] =
        useState<RefObject<HTMLAudioElement> | null>(null);

    const state: HotKeyState = {
        isRadioPlaying,
        setIsRadioPlaying,
        ports,
        setPorts,
        jukeboxElem,
        setJukeboxElem,
    };

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

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            // TODO use a map instead of a list of if statements
            // p for pause/play
            if (event.key === "p") {
                toggleRadio();
            }
            // j for pause/play of jukebox
            if (event.key === "j") {
                toggleJukebox();
            }
            // t for toggle
            if (event.key === "t") {
                toggleBetween();
            }
        },
        [toggleRadio, toggleBetween, toggleJukebox]
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
