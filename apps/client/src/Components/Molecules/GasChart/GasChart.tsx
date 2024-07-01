import { Card, CardContent } from "@mui/material";
import { FC } from "react";
import {
    Bar,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { useGetGasUsageQuery } from "../../../Services/energyUsageApi";
import { useGetGasTemperaturesQuery } from "../../../Services/generated/energyUsageApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import EnergyChart, { axisDateTimeFormatDay } from "../EnergyChart/EnergyChart";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";

const temperatureLineColors = ["#66bb6a", "#ff9100"];

const GasChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    const mode: "day" | "month" = "month" as "day" | "month";
    const {
        data: gasUsageResponse,
        isLoading,
        isFetching,
        error,
        refetch,
    } = useGetGasUsageQuery(undefined);

    const { data: gasTemperatureResponse } = useGetGasTemperaturesQuery();

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

    const sensors =
        gasTemperatureResponse?.flatMap((sensor) => sensor[0]) ?? [];

    const entries =
        gasTemperatureResponse?.flatMap((sensor) =>
            sensor.map((item) => ({
                time: new Date(item?.last_changed ?? 0).getTime(),
                [`${item.attributes?.friendly_name}`]: item.state,
            }))
        ) ?? [];

    const lines = sensors.slice(0, 2).map((sensor, i) => ({
        dataKey: sensor?.attributes?.friendly_name,
        stroke: temperatureLineColors[i],
        unit: "°C",
    }));

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
            {oldChart}
            {isBig && (
                <EnergyChart
                    data={entries}
                    config={{
                        lines,
                        bars: [
                            {
                                dataKey:
                                    sensors[2].attributes?.friendly_name ?? "",
                                fill: "#66bb6a",
                                unit: "m³",
                            },
                        ],
                        leftYAxis: {
                            unit: "m³",
                        },
                        rightYAxis: {
                            unit: "°",
                        },
                        tickCount: mode === "day" ? 24 : 30,
                        axisDateTimeFormat:
                            mode === "day" ? undefined : axisDateTimeFormatDay,
                    }}
                    isLoading={isLoading || isFetching}
                />
            )}
        </>
    );
};

export default GasChart;
