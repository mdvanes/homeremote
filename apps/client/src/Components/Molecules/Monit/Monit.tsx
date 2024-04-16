import { Card, CardContent } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetMonitStatusQuery } from "../../../Services/monitApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import MonitInstance from "./MonitInstance";

// Monit only updates once per minute on the backend
const UPDATE_INTERVAL_MS = 60 * 1000;

const Monit: FC = () => {
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const dispatch = useAppDispatch();
    const { data, isLoading, isFetching, error, refetch } =
        useGetMonitStatusQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    useEffect(() => {
        if (error) {
            setIsSkippingBecauseError(true);
            dispatch(logError(`Monit failed: ${getErrorMessage(error)}`));
        }
    }, [dispatch, error]);

    if (error) {
        return (
            <ErrorRetry marginate retry={() => refetch()}>
                Monit could not load
            </ErrorRetry>
        );
    }

    return (
        <Card>
            <CardContent>
                <LoadingDot isLoading={isLoading || isFetching} noMargin />
                {data?.monitlist.map((monit) => (
                    <MonitInstance monit={monit} key={monit.localhostname} />
                ))}
            </CardContent>
        </Card>
    );
};

export default Monit;
