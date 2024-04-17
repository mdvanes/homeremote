import { FC, useEffect, useState } from "react";
import { useGetStacksQuery } from "../../../Services/stacksApi";
import { useAppDispatch } from "../../../store";
import LoadingDot from "../LoadingDot/LoadingDot";
import { Alert, Grid, Stack } from "@mui/material";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { logError } from "../LogCard/logSlice";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import CardExpandBar from "../CardExpandBar/CardExpandBar";

const UPDATE_INTERVAL_MS = 30000;

export const DockerStackList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const dispatch = useAppDispatch();
    const { data, isLoading, isFetching, isError, error, refetch } =
        useGetStacksQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    useEffect(() => {
        if (error) {
            setIsSkippingBecauseError(true);
            dispatch(logError(`HomeSec failed: ${getErrorMessage(error)}`));
        }
    }, [error, dispatch]);

    if (isError) {
        return (
            <ErrorRetry retry={() => refetch()}>
                DockerStacks could not load
            </ErrorRetry>
        );
    }

    return (
        <>
            <LoadingDot isLoading={isLoading || isFetching} noMargin />
            <Grid container gap={0.5}>
                <Grid item xs>
                    {data && (
                        <Stack spacing={0.5}>
                            {data.map((stack) => (
                                <Alert
                                    severity={
                                        stack.Status === 0 ? "info" : "error"
                                    }
                                >
                                    {stack.Name}
                                </Alert>
                            ))}
                        </Stack>
                    )}
                </Grid>
                <Grid item xs>
                    {/* <Stack spacing={0.5}>
                        {containers2.map(mapInfo)}
                        {!isOpen && <div>{containerDots}</div>}
                    </Stack> */}
                </Grid>
            </Grid>
            {/* docker stack list{" "}
            <ul>
                {(data ?? []).map((stack) => (
                    <li>{stack.Name}</li>
                ))}
            </ul> */}
            <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ??? more`}
            />
        </>
    );
};

export default DockerStackList;
