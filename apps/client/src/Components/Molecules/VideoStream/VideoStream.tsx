import { LinearProgress, Paper, Typography } from "@mui/material";
import { FC, useEffect, useState } from "react";

const URL = `${process.env.NX_BASE_URL}/api/video-stream`;

const VideoStream: FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [hash, setHash] = useState("");

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${URL}/hash`);
                if (response.status !== 200) {
                    setHasError(true);
                }
                const data = await response.json();
                setHash(data["hash"]);
            } catch (err) {
                setHasError(true);
            }
            setIsLoading(false);
        })();
    }, []);

    if (isLoading) {
        return (
            <Typography variant="body1" textAlign="center">
                VideoStream is loading
                <LinearProgress color="primary" variant="indeterminate" />
            </Typography>
        );
    }

    if (hasError) {
        return (
            <Typography variant="body1" textAlign="center">
                VideoStream failed to load
            </Typography>
        );
    }

    return (
        <Paper style={{ aspectRatio: "16/9", overflow: "clip" }}>
            <video width="100%" controls src={`${URL}?hash=${hash}`} />
        </Paper>
    );
};

export default VideoStream;
