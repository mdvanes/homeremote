import { FC } from "react";
import { Box, Grid } from "@material-ui/core";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogCard from "../../Molecules/LogCard/LogCard";
import Streams from "../Streams/Streams";
import Docker from "../Docker/Docker";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";

import { makeStyles } from "@material-ui/core";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import ActiveConnections from "../../Molecules/ActiveConnections/ActiveConnections";
import DataLora from "../../Molecules/DataLora/DataLora";

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
                <ActiveConnections />
            </Grid>
            <Grid item xs={12} md>
                <Streams />
                <DataLora />
                <Box marginTop={2} />
                <Docker />
            </Grid>
            <Grid item xs={12} md={3}>
                <DownloadList />
            </Grid>
            <Grid item xs={12} md={2}>
                <UrlToMusic />
                <Box marginTop={2} />
                <LogCard />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
