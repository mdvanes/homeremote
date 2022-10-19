import HomeremoteStreamPlayer, {
    Ports,
} from "@mdworld/homeremote-stream-player";
import { Box } from "@mui/material";
import { FC, RefObject, useCallback, useEffect, useState } from "react";
import Jukebox from "../Jukebox/Jukebox";
import StyledStreamPlayer from "./StyledStreamPlayer";

const StreamContainer: FC = () => {
    // const [play, setPlay] = useState(false);
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

    // handle what happens on key press
    const handleKeyPress = useCallback(
        (event) => {
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
                // setPlay((prev) => !prev);
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
        <>
            <StyledStreamPlayer>
                <HomeremoteStreamPlayer
                    url={process.env.NX_BASE_URL || ""}
                    setPorts={setPorts}
                />
            </StyledStreamPlayer>
            <Box marginTop={2} />
            {/* <button
                style={{ marginTop: "1rem" }}
                onClick={() => {
                    console.log(ports, ports?.receivePlayPauseStatusPort);
                    if (ports?.receivePlayPauseStatusPort?.send) {
                        ports.receivePlayPauseStatusPort.send(
                            isRadioPlaying ? "Pause" : "Play"
                        );
                    }
                }}
            >
                External toggle: {isRadioPlaying ? "playing" : "paused"}
            </button> */}
            <Jukebox setJukeboxElem={setJukeboxElem} />
        </>
    );
};

export default StreamContainer;
