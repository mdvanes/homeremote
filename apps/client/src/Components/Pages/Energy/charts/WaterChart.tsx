import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    useGetWaterQuery,
    type GetWaterResponse,
} from "../../../../Services/generated/energyUsageApi";
import EnergyChart, {
    axisDateTimeFormatDayHour,
} from "../../../Molecules/EnergyChart/EnergyChart";

type WaterSensorItem = GetWaterResponse[0][0] & {
    delta?: number;
    liters?: number;
};

const INTERVAL_24_HOURS = 1000 * 60 * 60 * 24;
const INTERVAL_5_MIN = 1000 * 60 * 5;

const aggregateByInterval =
    (interval: number) =>
    (acc: WaterSensorItem[], next: WaterSensorItem): WaterSensorItem[] => {
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

export const WaterChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetWaterQuery({
        range: mode,
    });

    const sensorEntries: WaterSensorItem[] = data?.[0] ?? [];

    const interval = mode === "month" ? INTERVAL_24_HOURS : INTERVAL_5_MIN;

    const aggregatedByInterval = sensorEntries.reduce<WaterSensorItem[]>(
        aggregateByInterval(interval),
        []
    );

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
                {data &&
                    data.length &&
                    data.map((sensor) => (
                        <Chip
                            key={sensor[0].entity_id}
                            label={sensor[0].attributes?.friendly_name}
                        />
                    ))}
            </Stack>
            <EnergyChart
                data={aggregatedByInterval.map((item) => ({
                    time: new Date(item.last_changed ?? "0").getTime() ?? 1,
                    liters: item.liters,
                    state: item.state,
                }))}
                config={{
                    bars: [
                        {
                            dataKey: "liters",
                            fill: "#66bb6a",
                            unit: "l",
                        },
                    ],
                    rightYAxis: {
                        unit: "l",
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
