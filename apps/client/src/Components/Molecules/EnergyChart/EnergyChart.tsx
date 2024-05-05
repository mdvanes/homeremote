import { Card, CardContent } from "@mui/material";
import { FC } from "react";
import {
    Bar,
    ComposedChart,
    Line,
    type LineProps,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    type BarProps,
} from "recharts";
import LoadingDot from "../LoadingDot/LoadingDot";

interface SensorItem {
    day: string; // "2024-05-30"
}

interface SensorConfig {
    lines?: Omit<LineProps, "ref">[];
    bars?: Omit<BarProps, "ref">[];
    leftUnit?: string;
    rightUnit?: string;
}

const dateTimeFormat = (val: string): string => {
    // const [year, month, day] = val
    //     .slice(0, 10)
    //     .split("-");
    // console.log(year, month, day);

    // const date = new Date(
    //     year,
    //     month - 1,
    //     day
    // );

    const date = new Date(val);

    const formattedDate = date.toLocaleString("en-uk", {
        weekday: "short",
        day: "numeric",
        month: "2-digit",
        year: "numeric",
        // timeStyle: "short",
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
                                    dataKey="day"
                                    angle={-25}
                                    interval={0}
                                    style={{ fontSize: "10px" }}
                                    tickFormatter={dateTimeFormat}
                                />
                                <YAxis
                                    yAxisId="left"
                                    unit={config.leftUnit}
                                    style={{ fontSize: "10px" }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    unit={config.rightUnit}
                                    orientation="right"
                                    style={{ fontSize: "10px" }}
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
