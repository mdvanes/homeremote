import { Paper, Typography } from "@mui/material";
import Hls from "hls.js";
import { FC, useEffect, useRef, useState } from "react";

const MANIFEST_URL = `${process.env.NX_PUBLIC_BASE_URL}/api/video-stream/manifest.m3u8`;

const VideoStream: FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasError, setHasError] = useState(false);

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
    }, []);

    if (hasError) {
        return (
            <Typography
                variant="body1"
                sx={{
                    textAlign: "center",
                }}
            >
                VideoStream failed to load
            </Typography>
        );
    }

    return (
        <Paper style={{ aspectRatio: "16/9", overflow: "clip" }}>
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
