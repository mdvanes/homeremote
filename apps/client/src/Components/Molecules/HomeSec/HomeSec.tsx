import { FC } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";

export const HomeSec: FC = () => {
    // TODO handle error/loading
    const { data } = useGetHomesecStatusQuery(undefined);

    console.log(data?.status);

    return (
        <div>
            {data?.status}
            {data?.devices?.map((sensor) => (
                <div key={sensor.id}>
                    {sensor.name}: {sensor.status} {sensor.type_f} {sensor.rssi}
                </div>
            ))}
        </div>
    );
};

export default HomeSec;
