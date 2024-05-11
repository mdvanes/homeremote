import { Typography } from "@mui/material";
import { FC } from "react";
import { GetElectricExportsApiResponse } from "../../../../Services/generated/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

export type Row = GetElectricExportsApiResponse[0];

export type RowEntry = NonNullable<Row["entries"]>[0];

interface RowEntryAvg extends RowEntry {
    sum: number;
    avg?: number;
}

const COLORS = ["#66bb6a", "#ff9100", "#159bff", "#bb47d3"];

const sumDayUsage = (acc: number, next: Row) => {
    return acc + (next?.dayUsage ?? 0);
};

const avgDayUsage = (rows: Row[]) =>
    (rows.reduce(sumDayUsage, 0) / rows.length).toFixed(3);

const rowEntryToChartEntry =
    (year1Nr: number, year2Nr: number, year2Row: Row) =>
    (entry: RowEntry, index: number) => {
        const formatTime = entry.time?.replace(" ", "T") + ":00.000+02:00";
        const newDate = new Date(formatTime ?? "");

        return {
            time: newDate.getTime(),
            [year1Nr]: entry.v,
            // NOTE: assumes that timestamps matches indexes
            [year2Nr]: year2Row?.entries?.[index]?.v ?? 0,
        };
    };

const rowEntryToAvgChartEntry =
    (year1Nr: number, year2Nr: number, year2Row: Row) =>
    (entry: RowEntry, index: number) => {
        const formatTime = entry.time?.replace(" ", "T") + ":00.000+02:00";
        const newDate = new Date(formatTime ?? "");

        return {
            time: newDate.getTime(),
            [year1Nr]: (entry as RowEntryAvg).avg,
            // NOTE: assumes that timestamps matches indexes
            [year2Nr]: (year2Row?.entries?.[index] as RowEntryAvg).avg ?? 0,
        };
    };

const rowsToAvgRows = (rows: Row[]) => {
    const rowsWithSum = rows.slice(1).reduce((acc: Row, next: Row) => {
        const entries = acc.entries?.map((entry, i) => ({
            ...entry,
            sum: (entry.v ?? 0) + (next.entries?.[i].v ?? 0),
        }));
        return {
            ...acc,
            entries,
        };
    }, rows[0]);
    const rowsWithAvg = {
        ...rowsWithSum,
        entries: rowsWithSum.entries?.map((entry) => {
            return {
                ...entry,
                avg: (entry as RowEntryAvg).sum / rows.length,
            };
        }),
    };
    return rowsWithAvg;
};

// TODO draw chart for a specific day

export const ElectricChartCompareAvg: FC<{
    label: string;
    year1: Row[];
    year2: Row[];
}> = ({ year1, year2, label }) => {
    const year1Item1Date = new Date(year1[0].dateMillis ?? 0);
    const year1Item1Year = year1Item1Date.getFullYear();
    const year2Item1Year = new Date(year2[0].dateMillis ?? 0).getFullYear();

    // const entriesForFirstDay: { time: number }[] | undefined =
    //     year1[0].entries?.map(
    //         rowEntryToChartEntry(year1Item1Year, year2Item1Year, year2[0])
    //     );
    // const entries: { time: number }[] | undefined = year1.entries?.map(
    //     rowEntryToChartEntry(year1Item1Year, year2Item1Year, year2)
    // );

    const year1Avg = rowsToAvgRows(year1);
    const year2Avg = rowsToAvgRows(year2);

    const entries: { time: number }[] | undefined = year1Avg.entries?.map(
        rowEntryToAvgChartEntry(year1Item1Year, year2Item1Year, year2Avg)
    );

    const year1AvgDayUsage = avgDayUsage(year1);
    const year2AvgDayUsage = avgDayUsage(year2);

    return (
        <>
            <Typography variant="h4">
                {`Daily usage, averaged over ${year1.length} vs ${year2.length} ${label}`}
            </Typography>
            <Typography variant="h5">
                {`${year1AvgDayUsage} kWh avg per day in ${year1Item1Year} vs ${year2AvgDayUsage} kWh avg per day in ${year2Item1Year}`}
            </Typography>
            <EnergyChart
                data={entries}
                config={{
                    lines: [
                        {
                            dataKey: year1Item1Year,
                            stroke: COLORS[0],
                            unit: " Watt",
                        },
                        {
                            dataKey: year2Item1Year,
                            stroke: COLORS[1],
                            unit: " Watt",
                        },
                    ],
                    // leftYAxis: {
                    //     unit: "%",
                    // },
                    // rightYAxis: {
                    //     unit: "°",
                    // },
                }}
                isLoading={false}
            />
        </>
    );
};
