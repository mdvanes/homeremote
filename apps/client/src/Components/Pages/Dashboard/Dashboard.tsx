import { FC } from "react";
import { Box, Grid, makeStyles } from "@material-ui/core";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import LogCard from "../../Molecules/LogCard/LogCard";
import Streams from "../Streams/Streams";
import Docker from "../Docker/Docker";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
// import ActiveConnections from "../../Molecules/ActiveConnections/ActiveConnections";
import DataLora from "../../Molecules/DataLora/DataLora";
import VideoStream from "../../Molecules/VideoStream/VideoStream";
import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";

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
                {/* <ActiveConnections /> */}
            </Grid>
            <Grid item xs={12} md>
                <Streams />
                <Box marginTop={2} />
                <ServiceLinksBar />
                <Box marginTop={2} />
                <DataLora />
                <Box marginTop={2} />
                <Docker />
            </Grid>
            <Grid item xs={12} md={3}>
                <VideoStream />
                <Box marginTop={2} />
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
