import { FC } from "react";
import { CarTwinResponse } from "@homeremote/types";
import {
    Info as InfoIcon,
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
    Speed as SpeedIcon,
} from "@mui/icons-material";
import { Alert, Card, CardContent, Grid, Tooltip } from "@mui/material";
import useStyles from "./Doors.styles";

export const Doors: FC<{
    doors: CarTwinResponse["connected"]["doors"];
}> = ({ doors }) => {
    const { classes } = useStyles();
    const handleAuthConnected = () => {
        // TODO
    };

    if (!doors || doors === "ERROR") {
        return (
            <Alert severity="warning" onClick={handleAuthConnected}>
                Doors failed: authenticate connected vehicle
            </Alert>
        );
    }

    const carLock = () => {
        if (typeof doors.carLocked?.value === "undefined") {
            return;
        }
        return (
            <Tooltip
                title={doors.carLocked.value ? "car locked" : "car unlocked"}
            >
                {doors.carLocked.value ? (
                    <LockIcon color="success" />
                ) : (
                    <LockOpenIcon />
                )}
            </Tooltip>
        );
    };

    const getSegmentClass = (
        segment:
            | "hood"
            | "frontLeft"
            | "frontRight"
            | "rearLeft"
            | "rearRight"
            | "tailGate"
    ) => {
        const prefix = `segment ${segment}`;
        if (typeof doors[segment]?.value === "undefined") {
            return `${prefix} unknown`;
        }
        return doors[segment]?.value
            ? `${prefix} locked`
            : `${prefix} unlocked`;
    };

    return (
        <Grid container gap={2} alignItems="center">
            <Grid item>{carLock()}</Grid>
            <Grid item>
                <div className={classes.car}>
                    <div title="hood" className={getSegmentClass("hood")} />
                    <div className={classes.container}>
                        <div
                            title="frontRight"
                            className={getSegmentClass("frontRight")}
                        />
                        <div
                            title="frontLeft"
                            className={getSegmentClass("frontLeft")}
                        />
                    </div>
                    <div className={classes.container}>
                        <div className={getSegmentClass("rearRight")} />
                        <div className={getSegmentClass("rearLeft")} />
                    </div>
                    <div className={getSegmentClass("tailGate")} />
                </div>
            </Grid>

            {/* {!doors ? (
                "Doors failed: authenticate connected vehicle"
            ) : (
                <>
                   
                    {/* <li>frontLeft: {frontLeft.value}</li>
                        <li>frontRight: {frontRight.value}</li>
                        <li>hood: {hood.value}</li>
                        <li>rearLeft: {rearLeft.value}</li>
                        <li>rearRight: {rearRight.value}</li>
                        <li>tailGate: {tailGate.value}</li> * /}
                </>
            )} */}
        </Grid>
    );
};
