import AppsIcon from "@mui/icons-material/Apps";
import { Grid, IconButton } from "@mui/material";
import { FC, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { CarTabs } from "../../Molecules/CarTabs/CarTabs";
import { ClimateSensorsCard } from "../../Molecules/ClimateSensorsCard/ClimateSensorsCard";
import DockerStackListCard from "../../Molecules/DockerStackList/DockerStackListCard";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import GasChart from "../../Molecules/GasChart/GasChart";
import HomeSec from "../../Molecules/HomeSec/HomeSec";
import Jukebox from "../../Molecules/Jukebox/Jukebox";
import LogCard from "../../Molecules/LogCard/LogCard";
import Monit from "../../Molecules/Monit/Monit";
import Nextup from "../../Molecules/Nextup/Nextup";
import Schedule from "../../Molecules/Schedule/Schedule";
import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";
import { SpeedTestCard } from "../../Molecules/SpeedTestCard/SpeedTestCard";
import StreamContainer from "../../Molecules/StreamContainer/StreamContainer";
import SwitchBarList from "../../Molecules/SwitchBarList/SwitchBarList";
import { SwitchesCard } from "../../Molecules/SwitchesCard/SwitchesCard";
import UrlToMusic from "../../Molecules/UrlToMusic/UrlToMusic";
import VideoStream from "../../Molecules/VideoStream/VideoStream";
import Docker from "../Docker/Docker";

const useStyles = makeStyles()((theme) => ({
    container: {
        "& .card-dashboard-height": {
            minHeight: "374px",
        },
        "& > .MuiGrid-item > .MuiPaper-root, & > .MuiGrid-item > .switch-bar-list-wrapper, & > .MuiGrid-item > .MuiContainer-root":
            {
                marginBottom: theme.spacing(2),
            },
        "& > .MuiGrid-item > .switch-bar-list-wrapper > .MuiPaper-root": {
            marginBottom: theme.spacing(1),
        },
    },
}));

const Dashboard: FC = () => {
    const { classes } = useStyles();
    const [isLiteMode, setIsLiteMode] = useState(false);

    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid item xs={12} md={3}>
                <div className="switch-bar-list-wrapper">
                    <SwitchesCard />
                    <ClimateSensorsCard />
                    <SwitchBarList />
                </div>
                <GasChart />
                <HomeSec />
                <UrlToMusic />
                <SpeedTestCard />
                <LogCard />
            </Grid>
            <Grid item xs={12} md>
                <StreamContainer />
                <Jukebox />
                {(localStorage.getItem("showVideoStream") ?? "") === "true" ? (
                    <VideoStream />
                ) : undefined}
                <CarTabs />
                <DockerStackListCard />
                <IconButton
                    color="primary"
                    onClick={() => {
                        setIsLiteMode((prev) => !prev);
                    }}
                    title="Toggle light mode"
                >
                    <AppsIcon />
                </IconButton>
            </Grid>
            <Grid item xs={12} md={5}>
                <ServiceLinksBar />
                <Docker />
                {!isLiteMode && <Schedule />}
                {!isLiteMode && <DownloadList />}
                <Nextup />
                <Monit />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
