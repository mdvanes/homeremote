import { Chip, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    useGetWaterQuery,
    type GetWaterResponse,
} from "../../../../Services/generated/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

type WaterSensorItem = GetWaterResponse[0][0] & {
    delta?: number;
    liters?: number;
};

// const INTERVAL = 1000 * 60 * 5;
const INTERVAL = 1000 * 60 * 60 * 24;

// TODO show last day, week, month

export const WaterChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    // const mode: "day" | "month" = "day".toString() as "day" | "month";
    const { data, isLoading, isFetching } = useGetWaterQuery({ range: mode });

    const sensorEntries: WaterSensorItem[] = data?.[0] ?? [];

    const interval = mode === "month" ? 1000 * 60 * 60 * 24 : 1000 * 60 * 5;

    const dataAggregatedBy5Mins = sensorEntries.reduce<WaterSensorItem[]>(
        (acc, next) => {
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
        },
        []
    );

    return (
        <>
            <button
                onClick={() => {
                    setMode("day");
                }}
            >
                day
            </button>
            <button
                onClick={() => {
                    setMode("month");
                }}
            >
                month
            </button>
            <Stack direction="row" spacing={1} marginBottom={1}>
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
                data={dataAggregatedBy5Mins.map((item) => ({
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
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
