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

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    return (
        <Card>
            <CardContent>
                <LoadingDot isLoading={isLoading || isFetching} noMargin />

                {gasUsageResponse?.status === "OK" && (
                    <ComposedChart
                        width={380}
                        // width="100%"
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
                            // tickFormatter={(val) => val.toFixed(1)}
                        />
                        {/* TODO truncate temps toFixed(1) */}
                        <Tooltip labelFormatter={(val) => val} />
                        {/* <Legend /> */}
                        <Bar
                            yAxisId="left"
                            // type="monotone"
                            // TODO stronger typing?
                            dataKey="used" // m3 on this day
                            // stroke="#8884d8"
                            // activeDot={{ r: 8 }}
                            fill="#2d6196"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="temp.tempInside1.avg"
                            stroke="#66bb6a"
                        />
                        <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="temp.tempOutside1.avg"
                            stroke="#ff9100"
                        />
                    </ComposedChart>
                )}
            </CardContent>
        </Card>
    );
};

export default GasChart;
