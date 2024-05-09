import { Box, Button, LinearProgress, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    GetElectricExportsApiResponse,
    useGetElectricExportsQuery,
} from "../../../../Services/generated/energyUsageApi";
import styles from "./ElectricChart.module.scss";

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

export const ElectricChart2: FC = () => {
    const [filterMonth, setFilterMonth] = useState<string | undefined>();
    const [showCharts, setShowCharts] = useState(false);
    const { data, isLoading, isFetching, error } = useGetElectricExportsQuery();
    const [foo, setFoo] = useState<{
        year1Weekdays: Row[];
        year1Weekends: Row[];
        year2Weekdays: Row[];
        year2Weekends: Row[];
    }>();

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
        // console.log(
        //     new Date(file.dateMillis).getMonth()
        // );
        // return file.date;
    };

    const handleGenerate = () => {
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

        console.log(
            data?.filter(isSelectedRange).length,
            "non empty in range:",
            selectedMonthAndNonEmptyRows?.length,
            "2023, weekdays:",
            year1Weekdays.length,
            "weekends:",
            year1Weekends.length,
            "2024, weekdays:",
            year2Weekdays.length,
            "weekends:",
            year2Weekends.length
        );
        setShowCharts(true);
        setFoo({
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
            {showCharts ? (
                <div></div>
            ) : (
                <Box className={styles["electric-chart-table"]}>
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>file name</th>
                                <th>date</th>
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
