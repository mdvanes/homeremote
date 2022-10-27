import { Alert, Card, CardContent, Typography } from "@mui/material";
import { FC } from "react";
import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import LoadingDot from "../LoadingDot/LoadingDot";

const formatDuration = (s: number) => {
    const daysDecimal = s / 60 / 60 / 24;
    const days = Math.floor(daysDecimal);
    const hoursDecimal = (daysDecimal - days) * 24;
    const hours = Math.floor(hoursDecimal);
    const minutesDecimal = (hoursDecimal - hours) * 60;
    const minutes = Math.floor(minutesDecimal);
    // Monit only updates once per minute on the backend
    // const secondsDecimal = (minutesDecimal - minutes) * 60;
    // const seconds = Math.floor(secondsDecimal);
    return `${days}d ${hours}h ${minutes}m`;
};

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
                    <>
                        <Typography variant="h5">
                            {monit.localhostname}
                        </Typography>
                        <Typography variant="subtitle2">
                            uptime: {formatDuration(monit.uptime)}
                        </Typography>
                        {monit.services.map((n) => (
                            <Alert
                                severity={n.status === 0 ? "success" : "error"}
                                sx={{ marginBottom: "2px" }}
                            >
                                {n.name}
                            </Alert>
                        ))}
                    </>
                ))}
            </CardContent>
        </Card>
    );
};

export default Monit;
