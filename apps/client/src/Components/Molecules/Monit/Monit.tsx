import { Alert, Card, CardContent } from "@mui/material";
import { FC } from "react";
import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";
import MonitInstance from "./MonitInstance";

// Monit only updates once per minute on the backend
const UPDATE_INTERVAL_MS = 60 * 1000;

const Monit: FC = () => {
    const { data, isLoading, isFetching, error } = useGetMonitStatusQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    const loadProgress = isLoading || isFetching ? <LoadingDot /> : " ";

    return (
        <Card>
            <CardContent>
                {loadProgress}
                {data?.monitlist.map((monit) => (
                    <MonitInstance monit={monit} key={monit.localhostname} />
                ))}
            </CardContent>
        </Card>
    );
};

export default Monit;
