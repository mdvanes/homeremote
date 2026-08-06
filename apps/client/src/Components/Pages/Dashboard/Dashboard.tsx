import AppsIcon from "@mui/icons-material/Apps";
import { Grid, IconButton } from "@mui/material";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import { CarTabs } from "../../Molecules/CarTabs/CarTabs";
import ClimateSensorsCard from "../../Molecules/ClimateSensorsCard/ClimateSensorsCard";
// Replaced by the unified ServicesPanel (see below):
// import DockerStackListCard from "../../Molecules/DockerStackList/DockerStackListCard";
import DownloadList from "../../Molecules/DownloadList/DownloadList";
import GasChart from "../../Molecules/GasChart/GasChart";
import HomeSec from "../../Molecules/HomeSec/HomeSec";
import LogCard from "../../Molecules/LogCard/LogCard";
import Monit from "../../Molecules/Monit/Monit";
import Nextup from "../../Molecules/Nextup/Nextup";
import Schedule from "../../Molecules/Schedule/Schedule";
// Replaced by the unified ServicesPanel (see below):
// import ServiceLinksBar from "../../Molecules/ServiceLinksBar/ServiceLinksBar";
import ServiceLinkBarSection from "../../Molecules/ServicesPanel/ServiceLinkBarSection";
import ServicesPanelCard from "../../Molecules/ServicesPanel/ServicesPanelCard";
import SpeedTestCard from "../../Molecules/SpeedTestCard/SpeedTestCard";
import SwitchesCard from "../../Molecules/SwitchesCard/SwitchesCard";
import VideoStream from "../../Molecules/VideoStream/VideoStream";
import Caddy from "../Caddy/Caddy";
// Replaced by the unified ServicesPanel (see below):
// import Docker from "../Docker/Docker";

const useStyles = makeStyles()((theme) => ({
    container: {
        "& .card-dashboard-height": {
            minHeight: "374px",
        },
        "& > .MuiGrid-root > .MuiPaper-root, & > .MuiGrid-root > .switch-bar-list-wrapper, & > .MuiGrid-root > .MuiContainer-root":
            {
                marginBottom: theme.spacing(2),
            },
        "& > .MuiGrid-root > .switch-bar-list-wrapper > .MuiPaper-root": {
            marginBottom: theme.spacing(1),
        },
    },
}));

// NOTE: Stagger calls to Home Assistant API on mount
const DelayComponent: FC<PropsWithChildren<{ delayMs: number }>> = ({
    children,
    delayMs,
}) => {
    const [showChildren, setShowChildren] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowChildren(true);
        }, delayMs);
    }, [setShowChildren, delayMs]);

    if (!showChildren) {
        return null;
    }

    return <>{children}</>;
};

const Dashboard: FC = () => {
    const { classes } = useStyles();
    const [isLiteMode, setIsLiteMode] = useState(false);

    return (
        <Grid container spacing={2} className={classes.container}>
            <Grid
                size={{
                    xs: 12,
                    md: 3,
                }}
            >
                <SwitchesCard />
                <DelayComponent delayMs={500}>
                    <ClimateSensorsCard />
                </DelayComponent>
                <DelayComponent delayMs={1000}>
                    <GasChart />
                </DelayComponent>
                <HomeSec />
                <LogCard />
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: "grow",
                }}
            >
                {(localStorage.getItem("showVideoStream") ?? "") === "true" ? (
                    <VideoStream />
                ) : undefined}
                <CarTabs />
                {/* Replaced by the unified ServicesPanel in the right column: */}
                {/* <DockerStackListCard /> */}
                <SpeedTestCard />
                {!isLiteMode && <DownloadList />}
                {!isLiteMode && <Schedule />}
                {!isLiteMode && <Nextup />}
                <IconButton
                    color="primary"
                    onClick={() => {
                        setIsLiteMode((prev) => !prev);
                    }}
                    title="Toggle lite mode"
                >
                    <AppsIcon />
                </IconButton>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    md: 5,
                }}
            >
                <ServiceLinkBarSection />
                <ServicesPanelCard />
                {/* <ServiceLinksBar /> */}
                {/* <Docker /> */}
                <Monit />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
