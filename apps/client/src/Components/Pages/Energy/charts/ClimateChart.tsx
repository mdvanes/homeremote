import RefreshIcon from "@mui/icons-material/Refresh";
import { Button, Chip, IconButton, Stack } from "@mui/material";
import { FC, useState } from "react";
import { useGetTemperaturesQuery } from "../../../../Services/generated/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

const COLORS = ["#66bb6a", "#ff9100", "#159bff", "#bb47d3"];

export const ClimateChart: FC = () => {
    const [mode, setMode] = useState<"day" | "month">("day");
    const { data, isLoading, isFetching, refetch } = useGetTemperaturesQuery({
        range: mode,
    });

    // TODO add Domoticz temperature (Cresta)

    const sensors = data?.flatMap((sensor) => sensor[0]) ?? [];

    const entries =
        data?.flatMap((sensor) =>
            sensor.map((item) => ({
                time: new Date(item?.last_changed ?? 0).getTime(),
                [`${item.attributes?.friendly_name}`]: item.state,
            }))
        ) ?? [];

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                <Button
                    variant={mode === "day" ? "contained" : "outlined"}
                    onClick={() => {
                        setMode("day");
                    }}
                >
                    24H
                </Button>
                <Button
                    variant={mode === "month" ? "contained" : "outlined"}
                    onClick={() => {
                        setMode("month");
                    }}
                >
                    Month
                </Button>
                <IconButton
                    aria-label="refetch"
                    onClick={() => {
                        refetch();
                    }}
                >
                    <RefreshIcon />
                </IconButton>
                {sensors.map((sensor, i) => (
                    <Chip
                        key={sensor.entity_id}
                        label={sensor.attributes?.friendly_name}
                        style={{
                            color: COLORS[i],
                        }}
                    />
                ))}
            </Stack>
            <EnergyChart
                data={entries}
                config={{
                    lines: [
                        {
                            dataKey: sensors[0]?.attributes?.friendly_name,
                            stroke: COLORS[0],
                            unit: "°C",
                        },
                        {
                            dataKey: sensors[1]?.attributes?.friendly_name,
                            stroke: COLORS[1],
                            unit: "%",
                            yAxisId: "left",
                        },
                        {
                            dataKey: sensors[2]?.attributes?.friendly_name,
                            stroke: COLORS[2],
                            unit: "°C",
                        },
                        {
                            dataKey: sensors[3]?.attributes?.friendly_name,
                            stroke: COLORS[3],
                            unit: "°C",
                        },
                    ],
                    leftYAxis: {
                        unit: "%",
                    },
                    rightYAxis: {
                        unit: "°",
                    },
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
