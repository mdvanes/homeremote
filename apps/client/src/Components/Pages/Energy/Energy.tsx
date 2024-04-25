// temperatures / humidity
// gas
// electra
// water?

import {
    useGetTemperatureQuery,
    useGetWaterQuery,
} from "../../../Services/energyUsageApi";
import { FC } from "react";

export const Energy: FC = () => {
    const { data: temperatureData } = useGetTemperatureQuery(undefined);
    const { data: waterData } = useGetWaterQuery(undefined);

    return (
        <>
            <div>
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
            </div>
            <div>
                water:
                {waterData &&
                    waterData.length &&
                    waterData.map((sensors) => (
                        <ul>
                            {sensors.map((entry) => (
                                <li>
                                    {entry.last_changed} {entry.entity_id}{" "}
                                    {entry.state}
                                </li>
                            ))}
                        </ul>
                    ))}
            </div>
        </>
    );
};

export default Energy;
