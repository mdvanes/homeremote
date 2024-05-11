import { Button } from "@mui/material";
import { FC } from "react";
import { Row } from "./ElectricChartCompareAvg";
import styles from "./ElectricDataGrid.module.scss";

export const getAreSomeEmpty = (entries: Row["entries"]): boolean =>
    entries?.some((e) => typeof e.v === "undefined") ?? true;

export const ElectricChartRow: FC<{ data: Row; onClick: (_: Row) => void }> = ({
    data,
    onClick,
}) => {
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
                <Button
                    color="primary"
                    variant="text"
                    onClick={() => {
                        onClick(data);
                    }}
                >
                    {new Date(data.dateMillis).toLocaleDateString("en-gb", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                    })}
                </Button>
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
