import { Card, CardContent, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import {
    Bar,
    BarProps,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useGetGasUsageQuery } from "../../../Services/energyUsageApi";
import { useGetGasTemperaturesQuery } from "../../../Services/generated/energyUsageApiWithRetry";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import EnergyChart, {
    SensorItem,
    axisDateTimeFormatDay,
} from "../EnergyChart/EnergyChart";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import { RangeButtons } from "./RangeButtons";

const temperatureLineColors = ["#66bb6a", "#ff9100", "#2d6196"];

const UPDATE_INTERVAL_MS = 60 * 60 * 1000; // 1 x per hour

// TODO values are off. Also shows too few items for month range.
const GasTemperaturesChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    const dispatch = useAppDispatch();
    const [range, setRange] = useState<"day" | "week" | "month">("week");
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);

    const {
        data: gasTemperatureResponse,
        error,
        isLoading,
        isFetching,
        refetch,
        isError,
    } = useGetGasTemperaturesQuery(
        { range },
        {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        }
    );

    useEffect(() => {
        if (isError && error) {
            setIsSkippingBecauseError(true);
            dispatch(
                logError(
                    `GasTemperaturesChart failed: ${getErrorMessage(error)}`
                )
            );
        }
    }, [dispatch, error, isError]);

    if (error || !gasTemperatureResponse) {
        return (
            <ErrorRetry
                retry={() => {
                    setIsSkippingBecauseError(false);
                    refetch();
                }}
            >
                GasTemperaturesChart could not load
            </ErrorRetry>
        );
    }

    const sensors =
        gasTemperatureResponse?.flatMap((sensor) => sensor[0]) ?? [];

    const entriesBySensor = (
        gasTemperatureResponse?.flatMap(
            (sensor) =>
                sensor.map((item) => ({
                    time: new Date(item?.last_changed ?? 0).getTime(),
                    [`${item.attributes?.friendly_name ?? item?.entity_id}`]:
                        parseFloat(item.state ?? ""),
                }))
            // .slice(-1 * (mode === "day" ? 24 : 30))
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

            <EnergyChart
                data={entries}
                config={{
                    lines,
                    bars,
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
        </>
    );
};

// TODO replace old GasChart by new EnergyChart. Need to fix displaying of gas usage first.
const GasChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    const [isOpen, setIsOpen] = useState(false);

    const {
        data: gasUsageResponse,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetGasUsageQuery(undefined);

    if (error || !gasUsageResponse) {
        return (
            <ErrorRetry retry={() => refetch()}>
                GasChart: {getErrorMessage(error ?? Error("empty response"))}
            </ErrorRetry>
        );
    }

    const temperatureLines = Object.keys(gasUsageResponse.result[0].temp).map(
        (name, index) => (
            <Line
                key={name}
                name={`avg ${name}`}
                yAxisId="right"
                type="monotone"
                dataKey={`temp.${name}.avg`}
                stroke={temperatureLineColors[index]}
            />
        )
    );

    const oldChart = (
        <Card>
            <CardContent>
                <LoadingDot isLoading={isLoading || isFetching} noMargin />

                {gasUsageResponse?.status === "OK" && (
                    <div
                        style={{
                            width: "calc(100% + 20px)",
                            margin: "0 -10px",
                        }}
                    >
                        <ResponsiveContainer
                            width="100%"
                            aspect={isBig ? 4 : 1.7}
                        >
                            <ComposedChart
                                data={
                                    isBig
                                        ? gasUsageResponse.result
                                        : gasUsageResponse.result.slice(-7)
                                }
                                margin={{
                                    left: -35,
                                    right: -35,
                                }}
                            >
                                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                                <XAxis
                                    dataKey="day"
                                    angle={-25}
                                    interval={0}
                                    style={{ fontSize: "10px" }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    // unit="m³"
                                    style={{ fontSize: "10px" }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    unit="°"
                                    orientation="right"
                                    style={{ fontSize: "10px" }}
                                />
                                <Tooltip
                                    labelFormatter={(val) => {
                                        const [year, month, day] =
                                            val.split("-");

                                        const date = new Date(
                                            year,
                                            month - 1,
                                            day
                                        );

                                        const formattedDate =
                                            date.toLocaleDateString("en-uk", {
                                                weekday: "short",
                                                day: "numeric",
                                                month: "2-digit",
                                                year: "numeric",
                                            });
                                        return formattedDate;
                                    }}
                                    formatter={(val) => {
                                        // Temperature is number, gas usage is string
                                        if (typeof val === "number") {
                                            return val.toFixed(1) + "°C";
                                        }
                                        return val + "m³";
                                    }}
                                    wrapperStyle={{
                                        border: "none",
                                    }}
                                    contentStyle={{
                                        border: "none",
                                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    }}
                                />
                                <Bar
                                    yAxisId="left"
                                    dataKey="used" // m3 on this day
                                    fill="#2d6196"
                                />
                                {temperatureLines}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );

    return (
        <>
            <GasTemperaturesChart isBig={isBig} />

            {isOpen && <Stack mt={2}>{oldChart}</Stack>}

            {isBig && (
                <CardExpandBar
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    hint={`more`}
                />
            )}
        </>
    );
};

export default GasChart;
