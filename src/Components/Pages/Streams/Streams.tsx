import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";

const Streams: FC = () => (
    <div style={{ fontFamily: "Roboto" }}>
        <HomeremoteStreamPlayer url={process.env.REACT_APP_BASE_URL || ""} />
    </div>
);

export default Streams;
