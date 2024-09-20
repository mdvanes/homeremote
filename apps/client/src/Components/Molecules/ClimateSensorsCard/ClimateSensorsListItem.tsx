import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterIcon from "@mui/icons-material/Water";
import { ListItemIcon, ListItemText, Stack } from "@mui/material";
import { FC } from "react";
import { State } from "../../../Services/generated/smartEntitiesApi";

interface ClimateSensorsListItemProps {
    sensors: State[];
}

export const ClimateSensorsListItem: FC<ClimateSensorsListItemProps> = ({
    sensors,
}) => {
    return (
        <Stack direction="row" flexWrap="wrap">
            {sensors.map((t) => (
                <Stack
                    key={t.entity_id}
                    direction="row"
                    alignItems="center"
                    sx={{ paddingX: 2, flexGrow: 1 }}
                >
                    <ListItemIcon
                        sx={{ justifyContent: "center", minWidth: 24 }}
                    >
                        {t.attributes?.device_class === "temperature" && (
                            <DeviceThermostatIcon />
                        )}
                        {t.attributes?.device_class === "humidity" && (
                            <WaterIcon />
                        )}
                    </ListItemIcon>
                    <ListItemText
                        sx={{ flex: 1, paddingX: 1 }}
                        primary={`${t.state}${t.attributes?.unit_of_measurement}`}
                        secondary={t.attributes?.friendly_name}
                    />
                </Stack>
            ))}
        </Stack>
    );
};
