import { FC } from "react";
import { useGetHomesecDeviceListQuery } from "../../../Services/homesecApi";

export const HomeSec: FC = () => {
    // TODO handle error/loading
    const { data: devices } = useGetHomesecDeviceListQuery(undefined);

    console.log(devices);

    return (
        <div>
            {devices?.senrows.map((sensor) => (
                <div key={sensor.id}>
                    {sensor.name}: {sensor.status}
                </div>
            ))}
        </div>
    );
};

export default HomeSec;
