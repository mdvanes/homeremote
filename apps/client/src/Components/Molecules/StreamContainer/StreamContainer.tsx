import HomeremoteStreamPlayer, {
    Ports,
} from "@mdworld/homeremote-stream-player";
import { Box, Card, CardContent } from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import Jukebox from "../Jukebox/Jukebox";
import StyledStreamPlayer from "./StyledStreamPlayer";

const StreamContainer: FC = () => {
    const [play, setPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [ports, setPorts] = useState<Ports | null>(null);

    // handle what happens on key press
    const handleKeyPress = useCallback((event) => {
        if (event.key === "Control") {
            return;
        }
        if (event.ctrlKey) {
            console.log(`Key pressed: ctrl+${event.key}`);
        }
        // p for pause
        if (event.key === "t") {
            console.log("toggle radio v stream");
            setPlay((prev) => !prev);

            if (ports?.receivePlayPauseStatusPort?.send) {
                ports.receivePlayPauseStatusPort.send(
                    isPlaying ? "Pause" : "Play"
                );
            }
        }
    }, [ports, isPlaying]);

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
                setIsPlaying(newStatus === "Play" ? true : false);
            });
        }
    }, [ports]);

    return (
        <>
            <StyledStreamPlayer>
                <HomeremoteStreamPlayer
                    url={process.env.NX_BASE_URL || ""}
                    
                />
            </StyledStreamPlayer>
            <Box marginTop={2} />
            <button
                style={{ marginTop: "1rem" }}
                onClick={() => {
                    console.log(ports, ports?.receivePlayPauseStatusPort);
                    if (ports?.receivePlayPauseStatusPort?.send) {
                        ports.receivePlayPauseStatusPort.send(
                            isPlaying ? "Pause" : "Play"
                        );
                    }
                }}
            >
                External toggle: {isPlaying ? "playing" : "paused"}
            </button>
            <Jukebox play={play} />
        </>
    );
};

export default StreamContainer;
