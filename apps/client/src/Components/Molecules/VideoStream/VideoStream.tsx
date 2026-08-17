import {
    Close as CloseIcon,
    PlayArrow as PlayArrowIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material";
import { IconButton, Paper, Typography } from "@mui/material";
import Hls from "hls.js";
import { FC, useEffect, useRef, useState } from "react";

const MANIFEST_URL = `${process.env.NX_PUBLIC_BASE_URL}/api/video-stream/manifest.m3u8`;

const VideoStream: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);
    const [isOpen, setIsOpen] = useState(
        localStorage.getItem("showVideoStream") === "true"
    );
    const [isHover, setIsHover] = useState(false);

    const toggleOpen = (newOpen: boolean) => {
        setIsOpen(newOpen);
        localStorage.setItem("showVideoStream", newOpen.toString());
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) {
            return undefined;
        }

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.on(Hls.Events.ERROR, (_event, data) => {
                if (data.fatal) {
                    setHasError(true);
                }
            });
            hls.loadSource(MANIFEST_URL);
            hls.attachMedia(video);
            return () => hls.destroy();
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = MANIFEST_URL;
            return undefined;
        }

        setHasError(true);
        return undefined;
    }, [isOpen]);

    if (hasError) {
        return (
            <Typography
                variant="body1"
                sx={{
                    textAlign: "center",
                }}
            >
                VideoStream failed to load
                <IconButton
                    onClick={() => {
                        toggleOpen(false);
                        setTimeout(() => {
                            toggleOpen(true);
                        }, 1_000);
                    }}
                >
                    <RefreshIcon />
                </IconButton>
            </Typography>
        );
    }

    if (!isOpen) {
        return (
            <Typography
                variant="body1"
                sx={{
                    textAlign: "center",
                }}
            >
                Video Stream
                <IconButton onClick={() => toggleOpen(true)}>
                    <PlayArrowIcon />
                </IconButton>
            </Typography>
        );
    }

    return (
        <Paper
            style={{
                aspectRatio: "16/9",
                overflow: "clip",
                position: "relative",
            }}
            onMouseOver={() => setIsHover(true)}
            onMouseOut={() => setIsHover(false)}
        >
            <div
                style={{
                    visibility: isHover ? "visible" : "hidden",
                    position: "absolute",
                    height: "50px",
                    width: "100%",
                    textAlign: "center",
                    background:
                        "linear-gradient(to bottom, rgba(0, 0, 0, 0.9) 30%, rgba(0, 0, 0, 0) 100%)",
                }}
            >
                <IconButton onClick={() => toggleOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </div>
            <video
                ref={videoRef}
                data-testid="video-stream-player"
                width="100%"
                controls
                muted
                playsInline
            />
        </Paper>
    );
};

export default VideoStream;
