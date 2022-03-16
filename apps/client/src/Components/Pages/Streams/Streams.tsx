import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";

const Streams: FC = () => (
    <div style={{ fontFamily: "Roboto", maxWidth: "800px" }}>
        <HomeremoteStreamPlayer url={process.env.NX_BASE_URL || ""} />
    </div>
);

export default Streams;
