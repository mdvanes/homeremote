import { Box, Grid } from "@mui/material";
import { FC } from "react";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import LogCard from "../../Molecules/LogCard/LogCard";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";
import Docker from "../Docker/Docker";
// import ActiveConnections from "../../Molecules/ActiveConnections/ActiveConnections";
import { makeStyles } from "tss-react/mui";
import DataLora from "../../Molecules/DataLora/DataLora";
import Monit from "../../Molecules/Monit/Monit";
import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";
import StreamContainer from "../../Molecules/StreamContainer/StreamContainer";
import VideoStream from "../../Molecules/VideoStream/VideoStream";
import Jukebox from "../../Molecules/Jukebox/Jukebox";

const useStyles = makeStyles()(() => ({
    container: {
        marginBottom: "10px",
        "& .card-dashboard-height": {
            minHeight: "374px",
        },
    },
}));

const Dashboard: FC = () => {
    const { classes } = useStyles();
    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} md={3}>
                <SwitchBarList />
                {/* <ActiveConnections /> */}
                <Box marginTop={2} />
                <Box marginTop={2} />
                <LogCard />
            </Grid>
            <Grid item xs={12} md>
                <StreamContainer />
                <Box marginTop={2} />
                <Jukebox />
                <Box marginTop={2} />
                <ServiceLinksBar />
                <Box marginTop={2} />
                <VideoStream />
                <Box marginTop={2} />
                <UrlToMusic />
            </Grid>
            <Grid item xs={12} md={5}>
                <DataLora />
                <Box marginTop={2} />
                <Docker />
                <Box marginTop={2} />
                <DownloadList />
                <Box marginTop={2} />
                <Monit />
            </Grid>
            <Grid item xs={12} md={2}></Grid>
        </Grid>
    );
};

export default Dashboard;
