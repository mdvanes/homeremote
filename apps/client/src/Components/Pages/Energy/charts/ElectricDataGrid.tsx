import { Box, Button, LinearProgress, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    GetElectricExportsApiResponse,
    useGetElectricExportsQuery,
} from "../../../../Services/generated/energyUsageApi";
import { ElectricChartCompareAvg } from "./ElectricChartCompareAvg";
import styles from "./ElectricDataGrid.module.scss";

type Row = GetElectricExportsApiResponse[0];

const getAreSomeEmpty = (entries: Row["entries"]): boolean =>
    entries?.some((e) => typeof e.v === "undefined") ?? true;

const isWeekday = (row: Row): boolean =>
    ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].includes(
        row.dayOfWeek ?? ""
    );

const isWeekend = (row: Row): boolean => !isWeekday(row);

const isYear =
    (year: number) =>
    (row: Row): boolean =>
        new Date(row.dateMillis ?? 0).getFullYear() === year;

const ElectricChartRow: FC<{ data: Row }> = ({ data }) => {
    const areSomeEmpty = getAreSomeEmpty(data.entries);

    if (!data.dateMillis) {
        return null;
    }

    return (
        <tr key={data.exportName}>
            <td>
                <input type="checkbox" defaultChecked={!areSomeEmpty} />
            </td>
            <td>{data.exportName}</td>
            <td className={`${areSomeEmpty ? styles["empty"] : ""}`}>
                {new Date(data.dateMillis).toLocaleDateString("en-gb", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    weekday: "short",
                })}
            </td>
            <td>{data.dayUsage?.toFixed(3)}</td>
            {data.entries?.map((e, i) => (
                <td
                    key={i}
                    className={typeof e.v === "undefined" ? "empty" : ""}
                    title={e.time}
                >
                    {e.v}
                </td>
            ))}
        </tr>
    );
};

export const ElectricDataGrid: FC = () => {
    const [filterMonth, setFilterMonth] = useState<string | undefined>();
    const { data, isLoading, isFetching, error } = useGetElectricExportsQuery();
    const [chartData, setChartData] = useState<
        | {
              year1Weekdays: Row[];
              year1Weekends: Row[];
              year2Weekdays: Row[];
              year2Weekends: Row[];
          }
        | undefined
    >();

    if (error) {
        return <div>error</div>;
    }

    if (isLoading || isFetching) {
        return <LinearProgress />;
    }

    const isSelectedRange = (file: GetElectricExportsApiResponse[0]) => {
        if (!file.dateMillis) {
            return false;
        }
        const monthIndex = new Date(file.dateMillis).getMonth();

        if (filterMonth === "april" && monthIndex !== 3) {
            return false;
        }

        if (filterMonth === "may" && monthIndex !== 4) {
            return false;
        }

        return true;
    };

    const handleGenerate = () => {
        if (!filterMonth) {
            setChartData(undefined);
            return;
        }

        const selectedMonthAndNonEmptyRows =
            data
                ?.filter(isSelectedRange)
                .filter((row) => !getAreSomeEmpty(row.entries)) ?? [];

        const year1Weekdays = selectedMonthAndNonEmptyRows
            .filter(isWeekday)
            .filter(isYear(2023));
        const year1Weekends = selectedMonthAndNonEmptyRows
            .filter(isWeekend)
            .filter(isYear(2023));
        const year2Weekdays = selectedMonthAndNonEmptyRows
            .filter(isWeekday)
            .filter(isYear(2024));
        const year2Weekends = selectedMonthAndNonEmptyRows
            .filter(isWeekend)
            .filter(isYear(2024));

        setChartData({
            year1Weekdays,
            year1Weekends,
            year2Weekdays,
            year2Weekends,
        });
    };

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                <select
                    className={styles["select"]}
                    name="month"
                    id=""
                    onChange={(v) => {
                        setFilterMonth(v.target.value);
                    }}
                >
                    <option value=""></option>
                    <option value="april">april</option>
                    <option value="may">may</option>
                </select>
                <div>{filterMonth}</div>
                <Button onClick={handleGenerate}>generate</Button>
            </Stack>
            {chartData ? (
                <>
                    <ElectricChartCompareAvg
                        label="weekdays"
                        year1={chartData.year1Weekdays}
                        year2={chartData.year2Weekdays}
                    />
                    <ElectricChartCompareAvg
                        label="weekend days"
                        year1={chartData.year1Weekends}
                        year2={chartData.year2Weekends}
                    />
                </>
            ) : (
                <Box className={styles["electric-chart-table"]}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>file name</th>
                                <th>date</th>
                                <th></th>
                                {data?.[0] &&
                                    data?.[0].entries?.map((e) => (
                                        <th key={e.time}>
                                            {e.time?.slice(-5)}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.filter(isSelectedRange).map((file) => (
                                <ElectricChartRow
                                    key={file.exportName}
                                    data={file}
                                />
                            ))}
                        </tbody>
                    </table>
                </Box>
            )}
        </>
    );
};
