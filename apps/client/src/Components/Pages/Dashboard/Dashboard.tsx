import { Grid } from "@mui/material";
import { FC } from "react";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import LogCard from "../../Molecules/LogCard/LogCard";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";
import Docker from "../Docker/Docker";
import { makeStyles } from "tss-react/mui";
import DataLora from "../../Molecules/DataLora/DataLora";
import Monit from "../../Molecules/Monit/Monit";
import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";
import StreamContainer from "../../Molecules/StreamContainer/StreamContainer";
import VideoStream from "../../Molecules/VideoStream/VideoStream";
import Jukebox from "../../Molecules/Jukebox/Jukebox";
import Schedule from "../../Molecules/Schedule/Schedule";

const useStyles = makeStyles()((theme) => ({
    container: {
        "& .card-dashboard-height": {
            minHeight: "374px",
        },
        "& > .MuiGrid-item > .MuiPaper-root, & > .MuiGrid-item > .MuiContainer-root":
            {
                marginBottom: theme.spacing(2),
            },
    },
}));

const Dashboard: FC = () => {
    const { classes } = useStyles();
    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} md={3}>
                <SwitchBarList />
                <UrlToMusic />
                <LogCard />
            </Grid>
            <Grid item xs={12} md>
                <StreamContainer />
                <Jukebox />
                <VideoStream />
                <DataLora />
            </Grid>
            <Grid item xs={12} md={5}>
                <ServiceLinksBar />
                <Docker />
                <Schedule />
                <DownloadList />
                <Monit />
            </Grid>
            <Grid item xs={12} md={2}></Grid>
        </Grid>
    );
};

export default Dashboard;
