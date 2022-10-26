import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { FC } from "react";

const Monit: FC = () => {
    const { data, error } = useGetMonitStatusQuery(undefined);
    console.log(data, error);
    return <div>monit: {data?.names}</div>;
};

export default Monit;
