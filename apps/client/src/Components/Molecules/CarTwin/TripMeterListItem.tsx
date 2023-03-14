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

export const TripMeterListItem: FC<{
    statistics: CarTwinResponse["connected"]["statistics"];
    handleAuthConnected: () => void;
}> = ({ statistics, handleAuthConnected }) => {
    return (
        <>
            {/* {!statistics || statistics === "ERROR" ? (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Statistics failed: authenticate connected vehicle
                </Alert>
            ) : (
                <ListItem
                    secondaryAction={
                        <Tooltip
                            title=" NOTE: This number is multiplied by
                            100 as a correction, and should be
                            accurate to 100 km instead 1 km."
                        >
                            <InfoIcon />
                        </Tooltip>
                    }
                >
                    <ListItemIcon>
                        <Tooltip title="TODO">
                            <Filter1Icon />
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <>
                                {/*  TODO title - tripMeter1 (Manual Trip): * /}
                                {parseInt(
                                    statistics.tripMeter1?.value ?? "",
                                    10
                                ) * 100}{" "}
                                km{" "}
                                {/* <div>
                                           
                                        </div> * /}
                            </>
                        }
                    />
                </ListItem>
            )} */}
        </>
    );
};
