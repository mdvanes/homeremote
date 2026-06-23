import { Box } from "@mui/material";
import { FC, useState } from "react";
import { BarProps } from "recharts";
import { useGetGasTemperaturesQuery } from "../../../Services/generated/energyUsageApiWithRetry";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import EnergyChart, {
    SensorItem,
    axisDateTimeFormatDay,
} from "../EnergyChart/EnergyChart";
import { RangeButtons } from "./RangeButtons";

const temperatureLineColors = ["#66bb6a", "#ff9100", "#2d6196"];

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 x per hour

// TODO values have discrepancies with Home Assistant
const GasTemperaturesChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    const [range, setRange] = useState<"day" | "week" | "month">("week");

    const {
        data: gasTemperatureResponse,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(
        useGetGasTemperaturesQuery,
        { range },
        {
            name: "Gas & temperatures",
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    if (!gasTemperatureResponse) {
        return (
            <CardStatus
                name="Gas & temperatures"
                isError={isError}
                isStale={false}
                retry={retry}
            />
        );
    }

    const sensors =
        gasTemperatureResponse?.flatMap((sensor) => sensor[0]) ?? [];

    const entriesBySensor = (
        gasTemperatureResponse?.flatMap((sensor) =>
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

    const lines = sensors.slice(0, 2).map((sensor, i) => ({
        dataKey: sensor.attributes?.friendly_name ?? sensor?.entity_id,
        stroke: temperatureLineColors[i],
        unit: "°C",
    }));

    const bars: Omit<BarProps, "ref">[] = sensors
        .filter((sensor) => sensor?.attributes?.device_class === "gas")
        .map((sensor, i) => ({
            dataKey:
                sensor.attributes?.friendly_name ?? sensor.entity_id ?? "gas",
            fill: temperatureLineColors[i + lines.length],
            unit: "m³",
        }));

    return (
        <>
            {isBig && <RangeButtons range={range} setRange={setRange} />}

            <CardStatus
                name="Gas & temperatures"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
            />

            <Box sx={{ ...staleContentSx(isStale), marginBottom: 2 }}>
                <EnergyChart
                    data={entries}
                    config={{
                        lines,
                        bars,
                        leftYAxis: {
                            // unit: "m3",
                            domain: [0, "auto"],
                        },
                        rightYAxis: {
                            unit: "°",
                            domain: [0, "auto"],
                        },
                        xAxis: {
                            type: "category",
                        },
                        axisDateTimeFormat:
                            range === "day" ? undefined : axisDateTimeFormatDay,
                        hideBrush: !isBig,
                        hideToggleDots: !isBig,
                        aspect: isBig ? undefined : 2,
                        moreLink: isBig ? undefined : "/energy?tab=2",
                    }}
                    isLoading={isLoading || isFetching}
                />
            </Box>
        </>
    );
};

const GasChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    return <GasTemperaturesChart isBig={isBig} />;
};

export default GasChart;
