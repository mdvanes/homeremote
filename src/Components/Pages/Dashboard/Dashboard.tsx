import React, { FC } from "react";
import { Grid } from "@material-ui/core";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogCard from "../../Molecules/LogCard/LogCard";
import Streams from "../Streams/Streams";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    container: {
        "& .card-dashboard-height": {
            minHeight: "374px",
        },
    },
}));

const Dashboard: FC = () => {
    const classes = useStyles();
    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} md={3}>
                <SwitchBarList />
            </Grid>
            <Grid item xs={12} md>
                <Streams />
            </Grid>
            <Grid item xs={12} md={2}>
                <UrlToMusic />
            </Grid>
            <Grid item xs={12} md={2}>
                <LogCard />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
