import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    useGetElectricQuery,
    type GetElectricResponse,
} from "../../../../Services/generated/energyUsageApiWithRetry";
import EnergyChart, {
    axisDateTimeFormatDayHour,
} from "../../../Molecules/EnergyChart/EnergyChart";

type ElectricSensorItem = GetElectricResponse[0][0] & {
    delta?: number;
    liters?: number;
};

const COLORS = [
    "#66bb6a",
    "#ff9100",
    "#159bff",
    "#bb47d3",
    "#a0ff00",
    "#ff0021",
    "#00ffa5",
];

const INTERVAL_24_HOURS = 1000 * 60 * 60 * 24;
const INTERVAL_5_MIN = 1000 * 60 * 5;

const aggregateByInterval =
    (interval: number) =>
    (
        acc: ElectricSensorItem[],
        next: ElectricSensorItem
    ): ElectricSensorItem[] => {
        const prevEntry = acc.at(-1) ?? next;
        const prevTime = new Date(prevEntry.last_changed ?? "0").getTime();
        const nextTime = new Date(next.last_changed ?? "0").getTime();
        if (nextTime <= prevTime + interval) {
            return [
                ...acc.slice(0, -1),
                { ...prevEntry, liters: (prevEntry.liters ?? 0) + 1 },
            ];
        }
        return [...acc, { ...next, liters: (next.liters ?? 0) + 1 }];
    };

export const ElectricChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetElectricQuery({
        range: mode,
    });

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    // const sensorEntries = (data?.flatMap((sensor) => sensor[0]) ?? []).map(
    //     (item) => ({
    //         time: new Date(item?.last_changed ?? 0).getTime(),
    //         [`${item.attributes?.friendly_name}`]: item.state,
    //     })
    // );

    const sensorEntries =
        data
            ?.flatMap((sensor) =>
                sensor.map((item) => ({
                    time: new Date(item?.last_changed ?? 0).getTime(),
                    [`${item.attributes?.friendly_name}`]:
                        typeof item.state === "string"
                            ? Math.floor(parseInt(item.state) / 1000)
                            : 1,
                }))
            )
            .slice(0, 100) ?? [];

    const interval = mode === "month" ? INTERVAL_24_HOURS : INTERVAL_5_MIN;

    // const aggregatedByInterval = sensorEntries.reduce<ElectricSensorItem[]>(
    //     aggregateByInterval(interval),
    //     []
    // );

    // {
    //     dataKey: "liters",
    //     fill: "#66bb6a",
    //     unit: "l",
    // },

    const bars = sensors.map((sensor, i) => ({
        dataKey: sensor?.attributes?.friendly_name ?? "",
        fill: COLORS[i],
        unit: "kWh",
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
                {/* {data &&
                    data.length &&
                    data.map((sensor) => (
                        <Chip
                            key={sensor[0].entity_id}
                            label={sensor[0].attributes?.friendly_name}
                        />
                    ))} */}
            </Stack>
            <EnergyChart
                data={sensorEntries}
                // data={aggregatedByInterval.map((item) => ({
                //     time: new Date(item.last_changed ?? "0").getTime() ?? 1,
                //     liters: item.liters,
                //     state: item.state,
                // }))}
                config={{
                    bars,
                    rightYAxis: {
                        unit: "kWh",
                    },
                    // tickCount: mode === "day" ? 24 : 30,
                    axisDateTimeFormat:
                        mode === "day" ? undefined : axisDateTimeFormatDayHour,
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
