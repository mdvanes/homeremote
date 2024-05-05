import { useGetTemperatureQuery } from "../../../../Services/energyUsageApi";
import { FC } from "react";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";
import { Chip, Stack } from "@mui/material";

export const ClimateChart: FC = () => {
    const { data, isLoading, isFetching } = useGetTemperatureQuery(undefined);

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                {data &&
                    data.length &&
                    data.map((sensor) => <Chip label={sensor[0].entity_id} />)}
            </Stack>
            <EnergyChart
                data={data?.[0].map((item) => ({
                    day: item.last_changed,
                    value: item.state,
                }))}
                config={{
                    lines: [
                        {
                            dataKey: "value",
                            color: "#66bb6a",
                        },
                    ],
                    bars: [
                        {
                            dataKey: "value",
                            color: "#66bb6a",
                        },
                    ],
                }}
                isLoading={isLoading || isFetching}
            />
            temperature:
            {data &&
                data.length &&
                data.map((sensors) => (
                    <ul>
                        {sensors.map((entry) => (
                            <li>
                                {entry.last_changed} {entry.entity_id}{" "}
                                {entry.state}
                            </li>
                        ))}
                    </ul>
                ))}
        </>
    );
};
