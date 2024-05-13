import { Typography } from "@mui/material";
import { FC } from "react";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";
import type { Row, RowEntry } from "./ElectricChartCompareAvg";

const COLORS = ["#66bb6a", "#ff9100", "#159bff", "#bb47d3"];

const rowEntryToChartEntry = (yearMonthDay: string) => (entry: RowEntry) => {
    const formatTime = entry.time?.replace(" ", "T") + ":00.000+02:00";
    const newDate = new Date(formatTime ?? "");

    return {
        time: newDate.getTime(),
        [yearMonthDay]: entry.v,
    };
};

export const ElectricChartForRow: FC<{
    row: Row;
}> = ({ row }) => {
    const time = row.entries?.[0].time;
    const formatTime = time?.replace(" ", "T") + ":00.000+02:00";
    const newDate = new Date(formatTime ?? "");
    const yearMonthDay = newDate.toISOString().slice(0, 10);

    const entries: { time: number }[] | undefined = row.entries?.map(
        rowEntryToChartEntry(yearMonthDay)
    );

    return (
        <>
            <Typography variant="h4">
                {`Daily usage for ${yearMonthDay}, ${row.dayUsage} kWh`}
            </Typography>

            <EnergyChart
                data={entries}
                config={{
                    lines: [
                        {
                            dataKey: yearMonthDay,
                            stroke: COLORS[0],
                            unit: " Watt",
                        },
                    ],
                    tickCount: 24,
                }}
                isLoading={false}
            />
        </>
    );
};
