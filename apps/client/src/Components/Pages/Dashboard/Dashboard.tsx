import { Box, Grid } from "@mui/material";
import { FC } from "react";
import LogCard from "../../Molecules/LogCard/LogCard";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";
import Docker from "../Docker/Docker";
// import ActiveConnections from "../../Molecules/ActiveConnections/ActiveConnections";
import { makeStyles } from "tss-react/mui";
import DataLora from "../../Molecules/DataLora/DataLora";
import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";
import StreamContainer from "../../Molecules/StreamContainer/StreamContainer";
import VideoStream from "../../Molecules/VideoStream/VideoStream";

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
            </Grid>
            <Grid item xs={12} md>
                <StreamContainer />
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
