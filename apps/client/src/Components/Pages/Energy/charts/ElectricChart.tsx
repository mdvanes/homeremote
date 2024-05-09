import { Box, LinearProgress, Stack } from "@mui/material";
import { FC, useState } from "react";
import {
    GetElectricExportsApiResponse,
    useGetElectricExportsQuery,
} from "../../../../Services/generated/energyUsageApi";
import styles from "./ElectricChart.module.scss";

const ElectricChartRow: FC<{ data: GetElectricExportsApiResponse[0] }> = ({
    data,
}) => {
    const areSomeEmpty = data.entries?.some((e) => typeof e.v === "undefined");

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

export const ElectricChart: FC = () => {
    const [filterMonth, setFilterMonth] = useState<string | undefined>();
    const { data, isLoading, isFetching, error } = useGetElectricExportsQuery();

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
            </Stack>
            <Box className={styles["electric-chart-table"]}>
                <table>
                    <thead>
                        <tr>
                            <th></th>
                            <th>file name</th>
                            <th>date</th>
                            {data?.[0] &&
                                data?.[0].entries?.map((e) => (
                                    <th key={e.time}>{e.time?.slice(-5)}</th>
                                ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data?.filter(isSelectedRange).map((file) => (
                            <ElectricChartRow data={file} />
                        ))}
                    </tbody>
                </table>
            </Box>
        </>
    );
};
