import { Chip, Stack } from "@mui/material";
import { FC } from "react";
import { useGetTemperatureQuery } from "../../../../Services/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

export const ClimateChart: FC = () => {
    const { data, isLoading, isFetching } = useGetTemperatureQuery(undefined);

    const temps: { time: number; temperature?: string; humidity?: string }[] =
        data?.[0].map((item, index) => ({
            time: new Date(item.last_changed).getTime(),
            temperature: item.state,
        })) ?? [];

    const humids: { time: number; temperature?: string; humidity?: string }[] =
        data?.[1].map((item, index) => ({
            time: new Date(item.last_changed).getTime(),
            humidity: item.state,
        })) ?? [];

    const vals = temps.concat(humids);

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                {data &&
                    data.length &&
                    data.map((sensor) => (
                        <Chip
                            key={sensor[0].entity_id}
                            label={sensor[0].entity_id}
                        />
                    ))}
            </Stack>
            <EnergyChart
                data={vals}
                config={{
                    lines: [
                        {
                            dataKey: "temperature",
                            stroke: "#66bb6a",
                            unit: "°C",
                        },
                        {
                            dataKey: "humidity",
                            stroke: "#ff9100",
                            unit: "%",
                            yAxisId: "left",
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
