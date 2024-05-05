import { useGetTemperatureQuery } from "../../../Services/energyUsageApi";
import { FC } from "react";

export const ChartClimate: FC = () => {
    const { data: temperatureData } = useGetTemperatureQuery(undefined);

    return (
        <>
            temperature:
            {temperatureData &&
                temperatureData.length &&
                temperatureData.map((sensors) => (
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
