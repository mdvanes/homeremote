import { Box } from "@mui/material";
import { FC } from "react";
import { useGetElectricExportsQuery } from "../../../../Services/generated/energyUsageApi";
import styles from "./ElectricChart.module.scss";
// import "./ElectricChart.scss";

export const ElectricChart: FC = () => {
    const { data } = useGetElectricExportsQuery();
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
                    {data?.map((file) => (
                        <>
                            {file.dateMillis && (
                                <tr key={file.exportName}>
                                    <td>
                                        <input type="checkbox" />
                                    </td>
                                    <td>{file.exportName}</td>
                                    <td
                                        className={`${
                                            file.entries?.some(
                                                (e) =>
                                                    typeof e.v === "undefined"
                                            )
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
                                            style={{
                                                textAlign: "right",
                                                minWidth: "60px",
                                                backgroundColor:
                                                    typeof e.v === "undefined"
                                                        ? "red"
                                                        : "",
                                            }}
                                            title={e.time}
                                        >
                                            {e.v}
                                        </td>
                                    ))}
                                </tr>
                            )}
                        </>
                    ))}{" "}
                </tbody>
            </table>
        </Box>
    );
};
