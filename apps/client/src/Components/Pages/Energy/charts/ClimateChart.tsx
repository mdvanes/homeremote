import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import { useGetTemperaturesQuery } from "../../../../Services/generated/energyUsageApiWithRetry";
import EnergyChart, {
    axisDateTimeFormatDayHour,
} from "../../../Molecules/EnergyChart/EnergyChart";

const COLORS = [
    "#66bb6a",
    "#ff9100",
    "#159bff",
    "#bb47d3",
    "#a0ff00",
    "#ff0021",
    "#00ffa5",
];

export const ClimateChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetTemperaturesQuery({
        range: mode,
    });

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    const entries =
        data?.flatMap((sensor) =>
            sensor.map((item) => ({
                time: new Date(item?.last_changed ?? 0).getTime(),
                [`${item.attributes?.friendly_name}`]: item.state,
            }))
        ) ?? [];

    const lines = sensors.slice(2).map((sensor, i) => ({
        dataKey: sensor?.attributes?.friendly_name,
        stroke: COLORS[i + 2],
        unit: "°C",
    }));

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                <Button
                    variant={mode === "day" ? "contained" : "outlined"}
                    onClick={() => {
                        setMode("day");
                    }}
                >
                    24H
                </Button>
                <Button
                    variant={mode === "month" ? "contained" : "outlined"}
                    onClick={() => {
                        setMode("month");
                    }}
                >
                    Month
                </Button>
                <IconButton
                    aria-label="refetch"
                    onClick={() => {
                        refetch();
                    }}
                >
                    <RefreshIcon />
                </IconButton>
                {sensors.map((sensor, i) => (
                    <Chip
                        key={sensor.entity_id}
                        label={sensor.attributes?.friendly_name}
                        style={{
                            color: COLORS[i],
                        }}
                    />
                ))}
            </Stack>
            <EnergyChart
                data={entries}
                config={{
                    lines: [
                        {
                            dataKey: sensors[0]?.attributes?.friendly_name,
                            stroke: COLORS[0],
                            unit: "°C",
                        },
                        {
                            dataKey: sensors[1]?.attributes?.friendly_name,
                            stroke: COLORS[1],
                            unit: "%",
                            yAxisId: "left",
                        },
                    ].concat(lines),
                    leftYAxis: {
                        unit: "%",
                    },
                    rightYAxis: {
                        unit: "°",
                    },
                    tickCount: mode === "day" ? 24 : 30,
                    axisDateTimeFormat:
                        mode === "day" ? undefined : axisDateTimeFormatDayHour,
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
