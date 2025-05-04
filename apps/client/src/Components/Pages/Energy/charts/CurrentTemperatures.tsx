import { List, ListItem, Paper, Stack } from "@mui/material";
import { FC } from "react";
import { GetTemperaturesResponse } from "../../../../Services/generated/energyUsageApiWithRetry";
import { ClimateSensorsListItemContent } from "../../../Molecules/ClimateSensorsCard/ClimateSensorListItemContent";

export const isTemperature = (sensor: GetTemperaturesResponse[0][0]) =>
    sensor?.attributes?.device_class === "temperature";

const isHumidity = (sensor: GetTemperaturesResponse[0][0]) =>
    sensor?.attributes?.device_class === "humidity";

export const CurrentTemperatures: FC<{
    data: GetTemperaturesResponse | undefined;
}> = ({ data }) => {
    if (!data) {
        return null;
    }

    const isMobile = window.innerWidth < 600;

    const sensors: GetTemperaturesResponse[0] = data.map<
        GetTemperaturesResponse[0][0]
    >((sensor) => sensor.at(-1) ?? {});
    const temperatures = sensors.filter(isTemperature);
    const humidities = sensors.filter(isHumidity);

    return (
        <List component={Paper} sx={{ marginTop: 2 }}>
            <Stack
                direction={isMobile ? "column" : "row"}
                spacing={1}
                marginBottom={1}
                justifyContent="center"
                gap={10}
            >
                <div>
                    {temperatures.map((sensor) => {
                        return (
                            <ListItem>
                                <ClimateSensorsListItemContent
                                    sensor={sensor}
                                />
                            </ListItem>
                        );
                    })}
                </div>
                <div>
                    {humidities.map((sensor) => {
                        return (
                            <ListItem>
                                <ClimateSensorsListItemContent
                                    sensor={sensor}
                                />
                            </ListItem>
                        );
                    })}
                </div>
            </Stack>
        </List>
    );
};
