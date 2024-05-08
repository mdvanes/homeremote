import { Box, LinearProgress } from "@mui/material";
import { FC } from "react";
import { useGetElectricExportsQuery } from "../../../../Services/generated/energyUsageApi";
import styles from "./ElectricChart.module.scss";

export const ElectricChart: FC = () => {
    const { data, isLoading, isFetching, error } = useGetElectricExportsQuery();

    if (error) {
        return <div>error</div>;
    }

    if (isLoading || isFetching) {
        return <LinearProgress />;
    }

    return (
        <Box className={styles["electric-chart-table"]}>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>file name</th>
                        <th>date</th>
                        {data?.[0] &&
                            data?.[0].entries?.map((e) => (
                                <th>{e.time?.slice(-5)}</th>
                            ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.map((file) => {
                        const areSomeEmpty = file.entries?.some(
                            (e) => typeof e.v === "undefined"
                        );
                        return (
                            <>
                                {file.dateMillis && (
                                    <tr key={file.exportName}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={!areSomeEmpty}
                                            />
                                        </td>
                                        <td>{file.exportName}</td>
                                        <td
                                            className={`${
                                                areSomeEmpty
                                                    ? styles["empty"]
                                                    : ""
                                            }`}
                                        >
                                            {new Date(
                                                file.dateMillis
                                            ).toLocaleDateString("en-gb", {
                                                year: "numeric",
                                                month: "2-digit",
                                                day: "2-digit",
                                                weekday: "short",
                                            })}
                                        </td>
                                        {file.entries?.map((e, i) => (
                                            <td
                                                key={i}
                                                className={
                                                    typeof e.v === "undefined"
                                                        ? "empty"
                                                        : ""
                                                }
                                                title={e.time}
                                            >
                                                {e.v}
                                            </td>
                                        ))}
                                    </tr>
                                )}
                            </>
                        );
                    })}{" "}
                </tbody>
            </table>
        </Box>
    );
};
