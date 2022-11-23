import { Alert, Card, CardContent } from "@mui/material";
import Chart from "chart.js/auto";
import { FC, useEffect, useRef } from "react";
import { useGetGasUsageQuery } from "../../../Services/energyUsageApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";

// const data = [
//     { year: 2010, count: 10 },
//     { year: 2011, count: 20 },
//     { year: 2012, count: 15 },
//     { year: 2013, count: 25 },
//     { year: 2014, count: 22 },
//     { year: 2015, count: 30 },
//     { year: 2016, count: 28 },
// ];

const GasChart: FC = () => {
    const canvasElem = useRef<HTMLCanvasElement>(null);
    const {
        data: gasUsageResponse,
        isLoading,
        isFetching,
        error,
    } = useGetGasUsageQuery(undefined);

    useEffect(() => {
        // const myElem = document.getElementById("gas");
        // if (!myElem) {
        //     return;
        // }
        if (!canvasElem.current || !gasUsageResponse?.usage) {
            return;
        }
        const data = gasUsageResponse.usage;
        // const gasChart = new Chart(myElem as HTMLCanvasElement, {
        const gasChart = new Chart(canvasElem.current, {
            type: "bar",
            options: {
                animation: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false,
                    },
                },
            },
            data: {
                labels: data.map((row) => row.day),
                datasets: [
                    {
                        label: "??",
                        data: data.map((row) => row.m3),
                    },
                ],
            },
        });
        return () => {
            gasChart.destroy();
        };
    }, [gasUsageResponse]);

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    return (
        <Card>
            <CardContent>
                <LoadingDot isLoading={isLoading || isFetching} noMargin />
                <canvas ref={canvasElem}></canvas>
                {/* {JSON.stringify(gasUsageResponse)} */}
            </CardContent>
        </Card>
    );
};

export default GasChart;
