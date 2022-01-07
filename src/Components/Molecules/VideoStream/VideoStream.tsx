import React, { FC, useEffect, useState } from "react";
import { Paper } from "@material-ui/core";

const VideoStream: FC = () => {
    const [embedSrc, setEmbedSrc] = useState("");
    useEffect(() => {
        fetch("/api/nowplaying/radio2embed")
            .then((x) => x.text())
            .then((x: string) => setEmbedSrc(x));
    }, []);

    return (
        <Paper style={{ aspectRatio: "16/9", overflow: "clip" }}>
            {/* TODO also see https://github.com/streamlink/streamlink/pull/1084 */}
            <iframe
                src={embedSrc}
                allowFullScreen={true}
                allow="encrypted-media; autoplay; fullscreen"
                width="100%"
                height="100%"
                frameBorder="0"
                title="some_title"
            ></iframe>
        </Paper>
    );
};

export default VideoStream;
