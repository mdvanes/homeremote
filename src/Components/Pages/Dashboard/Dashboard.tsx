import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogContainer from "../../../Containers/LogContainer";

const Dashboard: FC = () => {
    return (
        <div style={{ marginTop: "100px" }}>
            <SwitchBarList />
            <HomeremoteStreamPlayer
                url={process.env.REACT_APP_BASE_URL || ""}
            />
            <LogContainer />
        </div>
    );
};

export default Dashboard;
