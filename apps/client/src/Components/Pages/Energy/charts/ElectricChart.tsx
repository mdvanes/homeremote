import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { lighten } from "@mui/material/styles";
import { FC, useState } from "react";
import { useGetElectricQuery } from "../../../../Services/generated/energyUsageApiWithRetry";
import EnergyChart, {
    SensorItem,
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

// The electricity meter device was replaced once, so sensors are configured
// in old/new pairs per tariff group (old,new,old,new,...). The old device's
// series is rendered in a lightened shade of its tariff group color, the new
// (current) device keeps the full color.
const colorForSensorIndex = (i: number) => {
    const groupIndex = Math.floor(i / 2);
    const isOldGeneration = i % 2 === 0;
    const baseColor = COLORS[groupIndex] ?? COLORS[COLORS.length - 1];
    return isOldGeneration ? lighten(baseColor, 0.5) : baseColor;
};

export const ElectricChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetElectricQuery({
        range: mode,
    });

    if (!data) {
        return <div>Loading...</div>;
    }

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

    const lines = sensors.slice(0, 8).map((sensor, i) => ({
        dataKey: sensor.attributes?.friendly_name ?? sensor?.entity_id,
        stroke: colorForSensorIndex(i),
        unit: "kWh",
    }));

    return (
        <>
            <Stack
                direction="row"
                spacing={1}
                useFlexGap
                sx={{
                    marginBottom: 1,
                    flexWrap: "wrap",
                }}
            >
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
                            color: colorForSensorIndex(i),
                        }}
                    />
                ))}
            </Stack>
            <EnergyChart
                data={entries}
                config={{
                    lines,
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
