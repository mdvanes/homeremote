import React, { FC } from "react";
import HomeremoteStreamPlayer from "@mdworld/homeremote-stream-player";
import { Grid } from "@material-ui/core";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogContainer from "../../../Containers/LogContainer";

const Dashboard: FC = () => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
                <SwitchBarList />
            </Grid>
            <Grid item xs={12} md={6}>
                <HomeremoteStreamPlayer
                    url={process.env.REACT_APP_BASE_URL || ""}
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <LogContainer />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
