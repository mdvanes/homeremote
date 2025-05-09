import { Button, Card, CardContent, Grid, Link } from "@mui/material";
import { FC, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    Bar,
    Brush,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    XAxisProps,
    YAxis,
    YAxisProps,
    type BarProps,
    type LineProps,
} from "recharts";
import LoadingDot from "../LoadingDot/LoadingDot";

export interface SensorItem {
    time: number;
}

interface SensorConfig {
    lines?: Omit<LineProps, "ref">[];
    bars?: Omit<BarProps, "ref">[];
    xAxis?: XAxisProps;
    leftYAxis?: YAxisProps;
    rightYAxis?: YAxisProps;
    tickCount?: number;
    axisDateTimeFormat?: (val: string) => string;
    hideBrush?: boolean;
    hideToggleDots?: boolean;
    aspect?: number;
    moreLink?: string;
}

const axisDateTimeFormatHour = (val: string): string => {
    const date = new Date(val);

    const formattedDate = date.toLocaleString("en-uk", {
        hour: "2-digit",
        minute: "2-digit",
    });
    return formattedDate;
};

export const axisDateTimeFormatDay = (val: string): string => {
    const date = new Date(val);

    const formattedDate = date.toLocaleString("en-uk", {
        day: "numeric",
        month: "2-digit",
    });
    return formattedDate;
};

export const axisDateTimeFormatDayHour = (val: string): string => {
    const date = new Date(val);

    const formattedDate = date.toLocaleString("en-uk", {
        day: "numeric",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
    return formattedDate;
};

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
    const [showDot, setShowDot] = useState(false);

    const chartLines = config.lines?.map((config, i) => (
        <Line
            dot={showDot}
            key={`${config.dataKey?.toString()}${i}`}
            yAxisId="right"
            type="monotone"
            {...config}
        />
    ));
    const chartBars = config.bars?.map((config) => (
        <Bar key={config.dataKey?.toString()} yAxisId="left" {...config} />
    ));

    const isMobile = window.innerWidth < 600;

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
                        <ResponsiveContainer
                            width="100%"
                            aspect={config.aspect ?? (isMobile ? 1 : 3)}
                        >
                            <ComposedChart
                                data={data}
                                margin={{
                                    left: -35,
                                    right: -35,
                                }}
                            >
                                <XAxis
                                    angle={-25}
                                    dataKey="time"
                                    domain={["auto", "auto"]}
                                    interval={0}
                                    style={{ fontSize: "10px" }}
                                    tickCount={config.tickCount}
                                    tickFormatter={
                                        config.axisDateTimeFormat ??
                                        axisDateTimeFormatHour
                                    }
                                    type="number"
                                    {...config.xAxis}
                                />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    style={{ fontSize: "10px" }}
                                    yAxisId="left"
                                    {...config.leftYAxis}
                                />
                                <YAxis
                                    domain={["auto", "auto"]}
                                    orientation="right"
                                    style={{ fontSize: "10px" }}
                                    yAxisId="right"
                                    {...config.rightYAxis}
                                />
                                <Tooltip
                                    formatter={(val) => {
                                        if ((val as number).toLocaleString) {
                                            return val.toLocaleString("en-uk", {
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 2,
                                            });
                                        }
                                        return val;
                                    }}
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
                                {/* TODO https://github.com/recharts/recharts/issues/2099 */}
                                {!config.hideBrush && (
                                    <Brush
                                        stroke="#2c6296"
                                        fill="#0d2a46"
                                        dataKey="time"
                                        type={config.xAxis?.type ?? "number"}
                                        tickFormatter={
                                            config.axisDateTimeFormat ??
                                            axisDateTimeFormatHour
                                        }
                                    />
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {!config.hideToggleDots && (
                    <Button
                        onClick={() => {
                            setShowDot((prev) => !prev);
                        }}
                    >
                        Toggle Dots
                    </Button>
                )}

                {config.moreLink && (
                    <Grid container justifyContent="flex-end" my={-2}>
                        <Grid item>
                            <Link component={RouterLink} to={config.moreLink}>
                                more
                            </Link>
                        </Grid>
                    </Grid>
                )}
            </CardContent>
        </Card>
    );
};

export default EnergyChart;
