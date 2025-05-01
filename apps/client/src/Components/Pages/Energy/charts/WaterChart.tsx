import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import { BarProps } from "recharts";
import { useGetWaterQuery } from "../../../../Services/generated/energyUsageApiWithRetry";
import EnergyChart, {
    SensorItem,
    axisDateTimeFormatDayHour,
} from "../../../Molecules/EnergyChart/EnergyChart";

const COLORS = ["#66bb6a"];

export const WaterChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetWaterQuery({
        range: mode,
    });

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    const entriesBySensor = (
        data?.flatMap((sensor) =>
            sensor
                .map((item) => ({
                    time: new Date(item?.last_changed ?? 0).getTime(),
                    [`${item.attributes?.friendly_name ?? item?.entity_id}`]:
                        parseFloat(item.state ?? ""),
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

    const bars: Omit<BarProps, "ref">[] = sensors.map((sensor, i) => ({
        dataKey: `${sensor.attributes?.friendly_name ?? sensor?.entity_id}`,
        fill: COLORS[i],
        unit: "l",
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
                data={entries}
                config={{
                    bars,
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
