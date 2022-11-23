import { Card, CardContent } from "@mui/material";
import { FC, useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
];

const GasChart: FC = () => {
    const canvasElem = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // const myElem = document.getElementById("gas");
        // if (!myElem) {
        //     return;
        // }
        if (!canvasElem.current) {
            return;
        }
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
                labels: data.map((row) => row.year),
                datasets: [
                    {
                        label: "Acquisitions by year",
                        data: data.map((row) => row.count),
                    },
                ],
            },
        });
        return () => {
            gasChart.destroy();
        };
    }, []);

    return (
        <Card>
            <CardContent>
                <canvas ref={canvasElem}></canvas>
            </CardContent>
        </Card>
    );
};

export default GasChart;
