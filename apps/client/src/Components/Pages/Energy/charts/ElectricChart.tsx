import { Typography } from "@mui/material";
import { FC } from "react";
import { GetElectricExportsApiResponse } from "../../../../Services/generated/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

export type Row = GetElectricExportsApiResponse[0];

const COLORS = ["#66bb6a", "#ff9100", "#159bff", "#bb47d3"];

export const ElectricChart: FC<{
    label: string;
    year1: Row[];
    year2: Row[];
}> = ({ year1, year2, label }) => {
    const year1Item1Date = new Date(year1[0].dateMillis ?? 0);
    const year1Item1Year = year1Item1Date.getFullYear();
    const year2Item1Year = new Date(year2[0].dateMillis ?? 0).getFullYear();

    // TODO add averaging
    const entries: { time: number }[] | undefined = year1[0].entries?.map(
        (entry, index) => {
            const formatTime = entry.time?.replace(" ", "T") + ":00.000+02:00";
            const newDate = new Date(formatTime ?? "");

            return {
                time: newDate.getTime(),
                [year1Item1Year]: entry.v,
                // TODO assumes that timestamps matches indexes
                [year2Item1Year]: year2[0]?.entries?.[index]?.v ?? 0,
            };
        }
    );

    // TODO This is very inaccurate, should come directly from Domoticz endpoint. Include in the getElectricExports response?
    const year1Item1Sum = year1[0].entries?.reduce((acc, next) => {
        return acc + (next?.v ?? 0);
    }, 0);
    const year2Item1Sum = year2[0].entries?.reduce((acc, next) => {
        return acc + (next?.v ?? 0);
    }, 0);

    return (
        <>
            <Typography variant="h4">
                {`Daily usage, averaged over ${year1.length} and ${year2.length} ${label}`}
            </Typography>
            <Typography variant="h5">
                {`${year1Item1Year} ${year1Item1Sum} avg per day vs ${year2Item1Year} ${year2Item1Sum} avg per day`}
            </Typography>
            <EnergyChart
                data={entries}
                config={{
                    lines: [
                        {
                            dataKey: year1Item1Year,
                            stroke: COLORS[0],
                            // unit: "kWh",
                        },
                        {
                            dataKey: year2Item1Year,
                            stroke: COLORS[1],
                            // unit: "%",
                            // yAxisId: "left",
                        },
                        // {
                        //     dataKey: sensors[2]?.attributes?.friendly_name,
                        //     stroke: COLORS[2],
                        //     unit: "°C",
                        // },
                        // {
                        //     dataKey: sensors[3]?.attributes?.friendly_name,
                        //     stroke: COLORS[3],
                        //     unit: "°C",
                        // },
                    ],
                    // leftYAxis: {
                    //     unit: "%",
                    // },
                    // rightYAxis: {
                    //     unit: "°",
                    // },
                }}
                isLoading={false}
                // isLoading={isLoading || isFetching}
            />
        </>
    );
};
