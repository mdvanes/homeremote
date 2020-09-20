import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";

const Dashboard: FC = () => (
    <HomeremoteStreamPlayer url={process.env.REACT_APP_BASE_URL || ""} />
);

export default Dashboard;
