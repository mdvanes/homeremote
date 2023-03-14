import { CarTwinResponse } from "@homeremote/types";
import {
    Info as InfoIcon,
    Lock as LockIcon,
    Speed as SpeedIcon,
    Tag as TagIcon,
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

export const OdoListItem: FC<{
    odometer: CarTwinResponse["connected"]["odometer"];
    handleAuthConnected: () => void;
}> = ({ odometer, handleAuthConnected }) => {
    return (
        <>
            {!odometer || odometer === "ERROR" ? (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Odometer failed: authenticate connected vehicle
                </Alert>
            ) : (
                <ListItem
                    secondaryAction={
                        <Tooltip
                            title="NOTE: This number is multiplied by 10 as a
        correction, and should be accurate to 10 km
        instead 1 km."
                        >
                            <InfoIcon />
                        </Tooltip>
                    }
                >
                    <ListItemIcon>
                        <Tooltip title="odometer">
                            <TagIcon />
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <>
                                {parseInt(odometer.value ?? "", 10) * 10}{" "}
                                {odometer.unit === "kilometers"
                                    ? "km"
                                    : odometer.unit}{" "}
                            </>
                        }
                    />
                </ListItem>
            )}
        </>
    );
};
