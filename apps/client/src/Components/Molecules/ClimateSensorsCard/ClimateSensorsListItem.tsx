import DeviceThermostatIcon from "@mui/icons-material/DeviceThermostat";
import WaterIcon from "@mui/icons-material/Water";
import { Box, Stack, Typography } from "@mui/material";
import { FC } from "react";
import { State } from "../../../Services/generated/smartEntitiesApiWithRetry";

interface ClimateSensorsListItemProps {
    sensors: State[];
}

interface AreaGroup {
    temperature?: State;
    humidity?: State;
}

const getAreaName = (sensor: State): string =>
    (sensor.attributes?.friendly_name ?? "")
        .replace(/\s*(temperature|humidity)\s*$/i, "")
        .trim();

const groupByArea = (sensors: State[]): [string, AreaGroup][] => {
    const map = sensors.reduce<Map<string, AreaGroup>>((acc, sensor) => {
        const area = getAreaName(sensor);
        const group = acc.get(area) ?? {};
        if (sensor.attributes?.device_class === "temperature") {
            group.temperature = sensor;
        } else if (sensor.attributes?.device_class === "humidity") {
            group.humidity = sensor;
        }
        acc.set(area, group);
        return acc;
    }, new Map<string, AreaGroup>());
    return [...map.entries()];
};

export const ClimateSensorsListItem: FC<ClimateSensorsListItemProps> = ({
    sensors,
}) => {
    const areas = groupByArea(sensors);

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: 0.5,
                padding: 1,
            }}
        >
            {areas.map(([area, { temperature, humidity }]) => (
                <Stack
                    key={area}
                    direction="row"
                    sx={{
                        alignItems: "center",
                        gap: 1,
                        paddingX: 1,
                        paddingY: 0.5,
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{ flex: 1, fontWeight: 500 }}
                        noWrap
                    >
                        {area}
                    </Typography>
                    {temperature && (
                        <Stack
                            direction="row"
                            sx={{ alignItems: "center", gap: 0.25 }}
                        >
                            <DeviceThermostatIcon
                                fontSize="small"
                                sx={{ opacity: 0.7 }}
                            />
                            <Typography variant="body2">
                                {parseFloat(
                                    temperature.state ?? "0"
                                ).toPrecision(3)}
                                {temperature.attributes?.unit_of_measurement}
                            </Typography>
                        </Stack>
                    )}
                    {humidity && (
                        <Stack
                            direction="row"
                            sx={{ alignItems: "center", gap: 0.25 }}
                        >
                            <WaterIcon fontSize="small" sx={{ opacity: 0.7 }} />
                            <Typography variant="body2">
                                {parseFloat(humidity.state ?? "0").toPrecision(
                                    2
                                )}
                                {humidity.attributes?.unit_of_measurement}
                            </Typography>
                        </Stack>
                    )}
                </Stack>
            ))}
        </Box>
    );
};
