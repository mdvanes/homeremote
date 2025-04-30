import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import { LineProps } from "recharts";
import {
    GetTemperaturesResponse,
    useGetTemperaturesQuery,
} from "../../../../Services/generated/energyUsageApiWithRetry";
import EnergyChart, {
    SensorItem,
    axisDateTimeFormatDayHour,
} from "../../../Molecules/EnergyChart/EnergyChart";

const COLORS = [
    "#66bb6a",
    "#66bb6a",
    "#ff9100",
    "#ff9100",
    "#159bff",
    "#159bff",
    "#bb47d3",
    "#a0ff00",
    "#a0ff00",
    "#ff0021",
    "#ff0021",
    "#00ffa5",
    "#00ffa5",
    "#aa9100",
];

const isTemperature = (sensor: GetTemperaturesResponse[0][0]) =>
    sensor?.attributes?.device_class === "temperature";

export const ClimateChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetTemperaturesQuery({
        range: mode,
    });

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    const entriesBySensor = (
        data?.flatMap((sensor) =>
            sensor
                .map((item) => ({
                    time: new Date(item?.last_changed ?? 0).getTime(),
                    [`${item.attributes?.friendly_name ?? item?.entity_id} ${
                        isTemperature(item) ? "T" : "H"
                    }`]: parseFloat(item.state ?? ""),
                }))
                .slice(1)
        ) ?? []
    ).toSorted((a, b) => {
        return a.time - b.time;
    });
    const entriesByTimestamp = entriesBySensor.reduce<
        Record<number, SensorItem>
    >((acc: Record<number, SensorItem>, item: SensorItem) => {
        acc[item.time] = { ...acc[item.time], ...item };
        return acc;
    }, {});
    const entries = Object.values(entriesByTimestamp);

    const lines: LineProps[] = sensors.map((sensor, i) => ({
        dataKey: `${sensor.attributes?.friendly_name ?? sensor?.entity_id} ${
            isTemperature(sensor) ? "T" : "H"
        }`,
        stroke: COLORS[i],
        unit: isTemperature(sensor) ? "°C" : "%",
        yAxisId: isTemperature(sensor) ? "right" : "left",
        strokeDasharray: isTemperature(sensor) ? undefined : "3 3",
    }));

    if (!data) {
        return <div>Loading...</div>;
    }

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
                {sensors
                    .reduce<
                        (GetTemperaturesResponse[0][0] & { hide: boolean })[]
                    >((acc, next) => {
                        const hasNameAlready = acc.some(
                            (item) =>
                                item.attributes?.friendly_name ===
                                next.attributes?.friendly_name
                        );
                        return [...acc, { ...next, hide: hasNameAlready }];
                    }, [])
                    .map((sensor, i) => (
                        <Chip
                            key={sensor.entity_id}
                            label={sensor.attributes?.friendly_name}
                            style={{
                                color: COLORS[i],
                                display: sensor.hide ? "none" : undefined,
                            }}
                        />
                    ))}
            </Stack>
            <EnergyChart
                data={entries}
                config={{
                    lines,
                    leftYAxis: {
                        domain: [-20, 100],
                        unit: "%",
                    },
                    rightYAxis: {
                        domain: [0, 60],
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
