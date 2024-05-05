import { Chip, Stack } from "@mui/material";
import { FC } from "react";
import { useGetTemperatureQuery } from "../../../../Services/energyUsageApi";
import EnergyChart from "../../../Molecules/EnergyChart/EnergyChart";

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
                data={data?.[0].map((item, index) => ({
                    day: item.last_changed,
                    temperature: item.state,
                    humidity: data?.[1]?.[index]?.state,
                }))}
                config={{
                    lines: [
                        {
                            dataKey: "temperature",
                            stroke: "#66bb6a",
                            unit: "°C",
                        },
                        {
                            dataKey: "humidity",
                            stroke: "#ff9100",
                            unit: "%",
                            yAxisId: "left",
                        },
                    ],
                    leftUnit: "%",
                    rightUnit: "°",
                }}
                isLoading={isLoading || isFetching}
            />
        </>
    );
};
