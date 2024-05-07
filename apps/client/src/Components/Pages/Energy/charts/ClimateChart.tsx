import { Chip, Stack } from "@mui/material";
import { FC } from "react";
import { useGetTemperaturesQuery } from "../../../../Services/generated/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

export const ClimateChart: FC = () => {
    const { data, isLoading, isFetching } = useGetTemperaturesQuery();

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    const vals =
        data?.flatMap((sensor) =>
            sensor.map((item) => ({
                time: new Date(item?.last_changed ?? 0).getTime(),
                [`${item.attributes?.friendly_name}`]: item.state,
            }))
        ) ?? [];

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                {sensors.map((sensor) => (
                    <Chip
                        key={sensor.entity_id}
                        label={sensor.attributes?.friendly_name}
                    />
                ))}
            </Stack>
            <EnergyChart
                data={vals}
                config={{
                    lines: [
                        {
                            dataKey: sensors[0]?.attributes?.friendly_name,
                            stroke: "#66bb6a",
                            unit: "°C",
                        },
                        {
                            dataKey: sensors[1]?.attributes?.friendly_name,
                            stroke: "#ff9100",
                            unit: "%",
                            yAxisId: "left",
                        },
                        {
                            dataKey: sensors[2]?.attributes?.friendly_name,
                            unit: "°C",
                        },
                    ],
                    leftYAxis: {
                        unit: "%",
                    },
                    rightYAxis: {
                        unit: "°",
                    },
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
