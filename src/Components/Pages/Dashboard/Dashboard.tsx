import React, { FC } from "react";
import { Grid } from "@material-ui/core";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogCard from "../../Molecules/LogCard/LogCard";
import Streams from "../Streams/Streams";

const Dashboard: FC = () => (
    <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
            <SwitchBarList />
        </Grid>
        <Grid item xs={12} md>
            <Streams />
        </Grid>
        <Grid item xs={12} md>
            <LogCard />
        </Grid>
    </Grid>
);

export default Dashboard;
