import HomeremoteStreamPlayer, {
    Ports,
} from "@mdworld/homeremote-stream-player";
import { Box } from "@mui/material";
import { FC, RefObject, useCallback, useEffect, useState } from "react";
import Jukebox from "../Jukebox/Jukebox";
import StyledStreamPlayer from "./StyledStreamPlayer";
import { useAppDispatch } from "../../../store";
import {
    // HotKeyProvider2,
    useHotKeyContext,
} from "../../Providers/HotKey/HotKeyProvider";
// import { setJukeboxElem, setPorts } from "../../Providers/HotKey/hotKeySlice";

const StreamContainer: FC = () => {
    // const dispatch = useAppDispatch();
    const { setPorts, setJukeboxElem } = useHotKeyContext();
    // const [isRadioPlaying, setIsRadioPlaying] = useState(false);
    // const [ports, setPorts] = useState<Ports | null>(null);
    // const [jukeboxElem, setJukeboxElem] =
    //     useState<RefObject<HTMLAudioElement> | null>(null);

    // const toggleRadio = useCallback(() => {
    //     if (ports?.receivePlayPauseStatusPort?.send) {
    //         ports.receivePlayPauseStatusPort.send(
    //             isRadioPlaying ? "Pause" : "Play"
    //         );
    //     }
    // }, [ports, isRadioPlaying]);

    // const toggleJukebox = useCallback(() => {
    //     if (jukeboxElem?.current) {
    //         if (jukeboxElem.current.paused) {
    //             jukeboxElem.current.play();
    //         } else {
    //             jukeboxElem.current.pause();
    //         }
    //     }
    // }, [jukeboxElem]);

    // const toggleBetween = useCallback(() => {
    //     if (ports?.receivePlayPauseStatusPort?.send) {
    //         ports.receivePlayPauseStatusPort.send(
    //             isRadioPlaying ? "Pause" : "Play"
    //         );
    //     }
    //     if (jukeboxElem?.current) {
    //         if (isRadioPlaying) {
    //             jukeboxElem.current.play();
    //         } else {
    //             jukeboxElem.current.pause();
    //         }
    //     }
    // }, [ports, isRadioPlaying, jukeboxElem]);

    // // handle what happens on key press
    // const handleKeyPress = useCallback(
    //     (event: KeyboardEvent) => {
    //         // TODO show legend
    //         // p for pause/play
    //         if (event.key === "p") {
    //             toggleRadio();
    //         }
    //         // j for pause/play of jukebox
    //         if (event.key === "j") {
    //             toggleJukebox();
    //         }
    //         // t for toggle
    //         if (event.key === "t") {
    //             // setPlay((prev) => !prev);
    //             toggleBetween();
    //         }
    //     },
    //     [toggleRadio, toggleBetween, toggleJukebox]
    // );

    // useEffect(() => {
    //     document.addEventListener("keydown", handleKeyPress);

    //     return () => {
    //         document.removeEventListener("keydown", handleKeyPress);
    //     };
    // }, [handleKeyPress]);

    // useEffect(() => {
    //     const subscribe = ports?.setPlayPauseStatusPort?.subscribe;
    //     if (subscribe) {
    //         subscribe((newStatus) => {
    //             setIsRadioPlaying(newStatus === "Play" ? true : false);
    //         });
    //     }
    // }, [ports]);

    // const setPorts = () => {
    //     dispatch(
    //         setIsRadioPlaying(newStatus === "Play" ? true : false)
    //     );
    // }

    return (
        <>
            <StyledStreamPlayer>
                <HomeremoteStreamPlayer
                    url={process.env.NX_BASE_URL || ""}
                    setPorts={setPorts}
                />
            </StyledStreamPlayer>
            <Box marginTop={2} />

            {/* <HotKeyProvider2 /> */}

            {/* TODO integrate setJukeboxElem in Jukebox */}
            <Jukebox
                // setJukeboxElem={(elem) => {
                //     dispatch(setJukeboxElem(elem));
                // }}
                setJukeboxElem={setJukeboxElem}
            />
        </>
    );
};

export default StreamContainer;
