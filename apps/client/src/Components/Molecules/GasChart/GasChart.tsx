import { Alert, Card, CardContent } from "@mui/material";
import { FC } from "react";
import { Bar, ComposedChart, Line, Tooltip, XAxis, YAxis } from "recharts";
import { useGetGasUsageQuery } from "../../../Services/energyUsageApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";

const GasChart: FC = () => {
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
                    <ComposedChart
                        width={380}
                        // TODO width="100%"
                        height={200}
                        data={gasUsageResponse.result.slice(-7)}
                        margin={{
                            left: -25,
                            right: -30,
                            // top: 5,
                            // right: 30,
                            // left: 20,
                            // bottom: 5,
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
                            unit="m³"
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
                )}
            </CardContent>
        </Card>
    );
};

export default GasChart;
