import { CarTwinResponse } from "@homeremote/types";
import {
    Info as InfoIcon,
    Lock as LockIcon,
    Speed as SpeedIcon,
    Tag as TagIcon,
    Filter1 as Filter1Icon,
} from "@mui/icons-material";
import {
    Alert,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";
import { Doors } from "./Doors";
import { OdoListItem } from "./OdoListItem";

// const minutesToDaysHoursMinutes = (minutesString: string) => {
//     const rawMinutes = parseInt(minutesString, 10);
//     const hours = Math.floor(rawMinutes / 60);
//     const days = Math.floor(hours / 24);
//     const hours1 = hours - days * 24;
//     const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;
//     return {
//         days,
//         hours: hours1,
//         minutes,
//     };
// };

// const hoursToDaysHours = (hoursString: string) => {
//     const hours = parseInt(hoursString, 10);
//     // const hours = Math.floor(rawMinutes / 60);
//     const days = Math.floor(hours / 24);
//     const hours1 = hours - days * 24;
//     // const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;
//     return {
//         days,
//         hours: hours1,
//     };
// };

export const CarTwinCard: FC<{
    data: CarTwinResponse;
    handleAuthConnected: () => void;
}> = ({ data, handleAuthConnected }) => {
    // const chargeTime = minutesToDaysHoursMinutes(estimatedChargingTime.value);
    // const toServiceTime = hoursToDaysHours(
    //     diagnostics.data.engineHoursToService.value
    // );

    const { odometer, doors, statistics, vehicleMetadata } = data.connected;

    return (
        <Card>
            <CardContent>
                <Grid container>
                    <Grid item>
                        {!vehicleMetadata || vehicleMetadata === "ERROR" ? (
                            <Alert
                                severity="warning"
                                onClick={handleAuthConnected}
                            >
                                Meta failed: authenticate connected vehicle
                            </Alert>
                        ) : (
                            <img
                                alt="car exterior"
                                src={
                                    vehicleMetadata.images
                                        ?.exteriorDefaultUrl ?? ""
                                }
                                width="300"
                            />
                        )}
                    </Grid>
                    <Grid item>
                        <List>
                            <OdoListItem
                                odometer={odometer}
                                handleAuthConnected={handleAuthConnected}
                            />
                        </List>
                        {/* <Grid container>
                            <Grid item>
                                <Alert severity="success">
                                    {!odometer || odometer === "ERROR" ? (
                                        "Odometer failed: authenticate connected vehicle"
                                    ) : (
                                        <>
                                            <SpeedIcon /> odometer:{" "}
                                            {parseInt(
                                                odometer.value ?? "",
                                                10
                                            ) * 10}{" "}
                                            {odometer.unit === "kilometers"
                                                ? "km"
                                                : odometer.unit}{" "}
                                            <Tooltip
                                                title="NOTE: This number is multiplied by 10 as a
                                correction, and should be accurate to 10 km
                                instead 1 km."
                                            >
                                                <InfoIcon />
                                            </Tooltip>
                                        </>
                                    )}
                                </Alert>
                            </Grid>
                        </Grid> */}
                        <ul>
                            {!statistics || statistics === "ERROR" ? (
                                "Statistics failed: authenticate connected vehicle"
                            ) : (
                                <>
                                    <li>
                                        <Filter1Icon />
                                        tripMeter1 (Manual Trip):{" "}
                                        {parseInt(
                                            statistics.tripMeter1?.value ?? "",
                                            10
                                        ) * 100}{" "}
                                        km{" "}
                                        {/* <div>
                                            NOTE: This number is multiplied by
                                            100 as a correction, and should be
                                            accurate to 100 km instead 1 km.
                                        </div> */}
                                    </li>
                                    {/* <li>tripMeter2: {statistics.data.tripMeter2.value} km</li> */}
                                    <li>
                                        <SpeedIcon />
                                        averageSpeed:{" "}
                                        {statistics.averageSpeed?.value} km/hr
                                    </li>
                                </>
                            )}

                            {/*<li>
                    engineHoursToService: {toServiceTime.days} day(s){" "}
                    {toServiceTime.hours} hour(s) [RAW:{" "}
                    {diagnostics.data.engineHoursToService.value} hours]
                </li>
                <li>kmToService: {diagnostics.data.kmToService.value} km</li>

                <li>batteryChargeLevel: {batteryChargeLevel.value}%</li>
                <li>
                    electricRange: {electricRange.value} {electricRange.unit}
                </li>
                <li>
                    estimatedChargingTime: {chargeTime.days} day(s){" "}
                    {chargeTime.hours} hour(s) {chargeTime.minutes} minute(s)
                    [RAW: {estimatedChargingTime.value}{" "}
                    {estimatedChargingTime.unit}]
                </li>
                <li>
                    chargingConnectionStatus: {chargingConnectionStatus.value}
                </li>
                <li>chargingSystemStatus: {chargingSystemStatus.value}</li> */}
                        </ul>
                    </Grid>
                    <Grid item>
                        <Doors
                            doors={doors}
                            handleAuthConnected={handleAuthConnected}
                        />
                        {/* {!doors || doors === "ERROR" ? (
                            "Doors failed: authenticate connected vehicle"
                        ) : (
                            <>
                                <li>
                                    {<LockIcon />} carLocked:{" "}
                                    {doors.carLocked?.value}
                                </li>
                                {/* <li>frontLeft: {frontLeft.value}</li>
                        <li>frontRight: {frontRight.value}</li>
                        <li>hood: {hood.value}</li>
                        <li>rearLeft: {rearLeft.value}</li>
                        <li>rearRight: {rearRight.value}</li>
                        <li>tailGate: {tailGate.value}</li> */}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
