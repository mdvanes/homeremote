import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterIcon from "@mui/icons-material/Water";
import { ListItemIcon, ListItemText } from "@mui/material";
import { FC } from "react";
import { State } from "../../../Services/generated/smartEntitiesApiWithRetry";

export const ClimateSensorsListItemContent: FC<{ sensor: State }> = ({
    sensor,
}) => {
    const precision = sensor.attributes?.device_class === "temperature" ? 3 : 2;
    return (
        <>
            <ListItemIcon sx={{ justifyContent: "center", minWidth: 24 }}>
                {sensor.attributes?.device_class === "temperature" && (
                    <DeviceThermostatIcon />
                )}
                {sensor.attributes?.device_class === "humidity" && (
                    <WaterIcon />
                )}
            </ListItemIcon>
            <ListItemText
                sx={{ flex: 1, paddingX: 1 }}
                primary={`${parseFloat(sensor.state ?? "0").toPrecision(
                    precision
                )}${sensor.attributes?.unit_of_measurement}`}
                secondary={sensor.attributes?.friendly_name}
            />
        </>
    );
};
