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
    YAxisProps,
    type BarProps,
    type LineProps,
} from "recharts";
import LoadingDot from "../LoadingDot/LoadingDot";

interface SensorItem {
    time: number;
}

interface SensorConfig {
    lines?: Omit<LineProps, "ref">[];
    bars?: Omit<BarProps, "ref">[];
    leftYAxis?: YAxisProps;
    rightYAxis?: YAxisProps;
}

const dateTimeFormat = (val: string): string => {
    const date = new Date(val);

    const formattedDate = date.toLocaleString("en-uk", {
        weekday: "short",
        day: "numeric",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
    return formattedDate;
};

export const EnergyChart: FC<{
    isLoading: boolean;
    data: SensorItem[] | undefined;
    config: SensorConfig;
}> = ({ isLoading, data, config }) => {
    const chartLines = config.lines?.map((config) => (
        <Line
            key={config.dataKey?.toString()}
            yAxisId="right"
            type="monotone"
            {...config}
        />
    ));
    const chartBars = config.bars?.map((config) => (
        <Bar yAxisId="left" {...config} />
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
                                    dataKey="time"
                                    angle={-25}
                                    interval={0}
                                    style={{ fontSize: "10px" }}
                                    tickFormatter={dateTimeFormat}
                                    type="number"
                                    domain={["auto", "auto"]}
                                />
                                <YAxis
                                    yAxisId="left"
                                    style={{ fontSize: "10px" }}
                                    domain={["auto", "auto"]}
                                    {...config.leftYAxis}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    style={{ fontSize: "10px" }}
                                    domain={["auto", "auto"]}
                                    {...config.rightYAxis}
                                />
                                <Tooltip
                                    labelFormatter={dateTimeFormat}
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
