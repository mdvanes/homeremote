import { Alert, Card, CardContent } from "@mui/material";
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
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";

const GasChart: FC<{ isBig?: boolean }> = ({ isBig = false }) => {
    const {
        data: gasUsageResponse,
        isLoading,
        isFetching,
        error,
    } = useGetGasUsageQuery(undefined);

    if (error || !gasUsageResponse) {
        return (
            <Alert severity="error">
                {getErrorMessage(error ?? Error("empty response"))}
            </Alert>
        );
    }

    const temperatureLineColors = ["#66bb6a", "#ff9100"];

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

    return (
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
                                {/* TODO needs offset */}
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
                                        const date = new Date();
                                        date.setFullYear(year);
                                        date.setMonth(month - 1);
                                        date.setDate(day);
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
                                    // TODO stronger typing?
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
};

export default GasChart;
