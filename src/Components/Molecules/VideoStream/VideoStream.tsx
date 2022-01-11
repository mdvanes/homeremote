import React, { FC, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";

const VideoStream: FC = () => {
    const [embedSrc, setEmbedSrc] = useState("");
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/nowplaying/radio2embed`)
            .then((url) => url.text())
            .then((url: string) => setEmbedSrc(url));
    }, []);

    return (
        <Paper style={{ aspectRatio: "16/9", overflow: "clip" }}>
            {/* TODO also see https://github.com/streamlink/streamlink/pull/1084 */}
            <iframe
                id="videostream"
                src={embedSrc}
                allowFullScreen={true}
                allow="encrypted-media; autoplay; fullscreen"
                frameBorder="0"
                title="embedded_video_stream"
                style={{
                    width: "calc(100% + 16px)",
                    height: "100%",
                    marginBottom: "-5px",
                }}
            ></iframe>
        </Paper>
    );
};

export default VideoStream;
