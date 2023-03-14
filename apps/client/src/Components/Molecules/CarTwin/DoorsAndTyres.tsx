import { CarTwinResponse } from "@homeremote/types";
import {
    Lock as LockIcon,
    LockOpen as LockOpenIcon,
} from "@mui/icons-material";
import { Alert, Grid, Tooltip } from "@mui/material";
import { FC } from "react";
import useStyles from "./DoorsAndTyres.styles";

export const DoorsAndTyres: FC<{
    doors: CarTwinResponse["connected"]["doors"];
    tyres: CarTwinResponse["connected"]["tyres"];
    handleAuthConnected: () => void;
}> = ({ doors, tyres, handleAuthConnected }) => {
    const { classes } = useStyles();

    if (!doors || doors === "ERROR") {
        return (
            <Alert severity="warning" onClick={handleAuthConnected}>
                Doors failed: authenticate connected vehicle
            </Alert>
        );
    }

    if (!tyres || tyres === "ERROR") {
        return (
            <Alert severity="warning" onClick={handleAuthConnected}>
                Tyres failed: authenticate connected vehicle
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
                    <LockOpenIcon color="error" />
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

    const getTyreClass = (
        tyre: "frontLeft" | "frontRight" | "rearLeft" | "rearRight"
    ) => {
        const prefix = `tyre ${tyre}`;
        if (typeof tyres[tyre]?.value === "undefined") {
            return `${prefix} unknown`;
        }
        return tyres[tyre]?.value === "TYRE_PRESSURE_WARNING_TYPE_NO_WARN"
            ? `${prefix} ok`
            : `${prefix} warn`;
    };

    return (
        <Grid container gap={2} alignItems="center" justifyContent="center">
            <Grid item>{carLock()}</Grid>
            <Grid item>
                <div className={classes.car}>
                    <div title="hood" className={getSegmentClass("hood")} />
                    <div className={classes.container}>
                        <div
                            title="Front right tyre"
                            className={getTyreClass("frontRight")}
                        />
                        <div
                            title="frontRight"
                            className={getSegmentClass("frontRight")}
                        />
                        <div
                            title="frontLeft"
                            className={getSegmentClass("frontLeft")}
                        />
                        <div
                            title="Front left tyre"
                            className={getTyreClass("frontLeft")}
                        />
                    </div>
                    <div className={classes.container}>
                        <div
                            title="Rear right tyre"
                            className={getTyreClass("rearRight")}
                        />
                        <div
                            title="Rear right door"
                            className={getSegmentClass("rearRight")}
                        />
                        <div
                            title="Rear left door"
                            className={getSegmentClass("rearLeft")}
                        />
                        <div
                            title="Rear left tyre"
                            className={getTyreClass("rearLeft")}
                        />
                    </div>
                    <div
                        title="tailGate"
                        className={getSegmentClass("tailGate")}
                    />
                </div>
            </Grid>
        </Grid>
    );
};
