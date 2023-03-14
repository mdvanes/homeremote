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
import { DoorsAndTyres } from "./DoorsAndTyres";
import { OdoListItem } from "./OdoListItem";
import { ServiceListItems } from "./ServiceListItems";
import { StatisticsListItems } from "./StatisticsListItems";

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

    const { odometer, doors, statistics, diagnostics, vehicleMetadata, tyres } =
        data.connected;

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
                    <Grid item alignItems="flex-end">
                        <DoorsAndTyres
                            doors={doors}
                            tyres={tyres}
                            handleAuthConnected={handleAuthConnected}
                        />
                        <List dense>
                            <ServiceListItems
                                diagnostics={diagnostics}
                                handleAuthConnected={handleAuthConnected}
                            />
                        </List>
                    </Grid>
                    <Grid item>
                        <List dense>
                            <OdoListItem
                                odometer={odometer}
                                handleAuthConnected={handleAuthConnected}
                            />

                            <StatisticsListItems
                                statistics={statistics}
                                handleAuthConnected={handleAuthConnected}
                            />
                        </List>

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
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
