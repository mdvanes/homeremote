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
import LoadingDot from "../LoadingDot/LoadingDot";

interface SensorItem {
    day: string; // "2024-05-30"
    // value: string; // 2.11
}

interface SensorConfigItem {
    dataKey: string;
    color: string;
}

interface SensorConfig {
    lines?: SensorConfigItem[];
    bars?: SensorConfigItem[];
}

export const EnergyChart: FC<{
    isLoading: boolean;
    data: SensorItem[] | undefined;
    config: SensorConfig;
}> = ({ isLoading, data, config }) => {
    const chartLines = config.lines?.map(({ dataKey, color }) => (
        <Line
            key={dataKey}
            name={`avg ${dataKey}`}
            yAxisId="right"
            type="monotone"
            dataKey={dataKey}
            stroke={color}
        />
    ));
    const chartBars = config.bars?.map(({ dataKey }) => (
        <Bar
            yAxisId="left"
            dataKey={dataKey} // m3 on this day
            fill="#2d6196"
        />
    ));

    return (
        <Card>
            <CardContent>
                <LoadingDot isLoading={isLoading} noMargin />

                {data && (
                    <div
                        style={{
                            width: "calc(100% + 20px)",
                            margin: "0 -10px",
                        }}
                    >
                        <ResponsiveContainer width="100%" aspect={4}>
                            <ComposedChart
                                data={data}
                                margin={{
                                    left: -35,
                                    right: -35,
                                }}
                            >
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
                                {chartBars}
                                {chartLines}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EnergyChart;
