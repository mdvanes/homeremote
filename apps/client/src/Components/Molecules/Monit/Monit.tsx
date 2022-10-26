import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { FC } from "react";

const Monit: FC = () => {
    const { data, error } = useGetMonitStatusQuery(undefined);
    console.log(data, error);
    return (
        <div>
            monit:{" "}
            {data?.monitlist.map((monit) => (
                <>
                    {monit.localhostname} {monit.uptime}
                    <ul>
                        {monit.serviceNames.map((n) => (
                            <li>{n}</li>
                        ))}
                    </ul>
                </>
            ))}
        </div>
    );
};

export default Monit;
