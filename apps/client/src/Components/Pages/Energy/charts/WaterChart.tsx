import { Chip, Stack } from "@mui/material";
import { FC } from "react";
import { useGetWaterQuery } from "../../../../Services/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

export const WaterChart: FC = () => {
    const { data, isLoading, isFetching } = useGetWaterQuery(undefined);

    return (
        <>
            <Stack direction="row" spacing={1} marginBottom={1}>
                {data &&
                    data.length &&
                    data.map((sensor) => (
                        <Chip
                            key={sensor[0].entity_id}
                            label={sensor[0].entity_id}
                        />
                    ))}
            </Stack>
            <EnergyChart
                data={data?.[0].map((item) => ({
                    day: item.last_changed,
                    liters: item.state,
                }))}
                config={{
                    lines: [
                        {
                            dataKey: "liters",
                            stroke: "#66bb6a",
                            unit: "l",
                        },
                    ],

                    rightUnit: "l",
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
