import { CarTwinResponse } from "@homeremote/types";
import {
    Info as InfoIcon,
    Tag as TagIcon,
    Opacity as OpacityIcon,
    CleaningServices as CleaningServicesIcon,
} from "@mui/icons-material";
import {
    Alert,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";

const hoursToDaysHours = (hoursString: string) => {
    const hours = parseInt(hoursString, 10);
    // const hours = Math.floor(rawMinutes / 60);
    const days = Math.floor(hours / 24);
    const hours1 = hours - days * 24;
    // const minutes = rawMinutes - hours1 * 60 - days * 24 * 60;
    return {
        days,
        hours: hours1,
    };
};

export const ServiceListItems: FC<{
    diagnostics: CarTwinResponse["connected"]["diagnostics"];
    handleAuthConnected: () => void;
}> = ({ diagnostics, handleAuthConnected }) => {
    if (!diagnostics || diagnostics === "ERROR") {
        return (
            <Alert severity="warning" onClick={handleAuthConnected}>
                Diagnostics failed: authenticate connected vehicle
            </Alert>
        );
    }

    const toServiceTime = hoursToDaysHours(
        diagnostics.engineHoursToService?.value ?? "0"
    );

    return (
        <>
            <ListItem
                secondaryAction={
                    <Tooltip
                        title={`Raw: ${diagnostics.engineHoursToService?.value} hours`}
                    >
                        <InfoIcon />
                    </Tooltip>
                }
            >
                <ListItemIcon>
                    <Tooltip title="engineHoursToService">
                        <CleaningServicesIcon />
                    </Tooltip>
                </ListItemIcon>
                <ListItemText
                    primary={
                        <>
                            {toServiceTime.days} day(s) {toServiceTime.hours}{" "}
                            hour(s)
                        </>
                    }
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <Tooltip title="kmToService">
                        <CleaningServicesIcon />
                    </Tooltip>
                </ListItemIcon>
                <ListItemText
                    primary={`${diagnostics.kmToService?.value} km`}
                />
            </ListItem>
            <ListItem>
                <ListItemIcon>
                    <Tooltip title="washerFluidLevel">
                        <OpacityIcon />
                    </Tooltip>
                </ListItemIcon>
                <ListItemText
                    primary={`${
                        diagnostics.washerFluidLevel?.value ===
                        "WASHER_FLUID_LEVEL_STATUS_OFF"
                            ? "OK"
                            : "EMPTY"
                    }`}
                />
            </ListItem>
        </>
    );
};
