import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { BACKOFF_DELAY, useGetStacksQuery } from "../../../Services/stacksApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import DockerStackItem from "./DockerStackItem";

export const DockerStackList: FC = () => {
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const dispatch = useAppDispatch();
    const { data, isLoading, isFetching, isError, error, refetch, isSuccess } =
        useGetStacksQuery(undefined, {
            pollingInterval: isSkippingBecauseError ? undefined : BACKOFF_DELAY,
        });

    useEffect(() => {
        if (isError && error) {
            setIsSkippingBecauseError(true);
            dispatch(
                logError(`DockerStacks failed: ${getErrorMessage(error)}`)
            );
        }
    }, [dispatch, error, isError]);

    useEffect(() => {
        if (isSuccess) {
            // Resume interval when (auto) retry is successful
            setIsSkippingBecauseError(false);
        }
    }, [isSuccess]);

    if (isError) {
        return (
            <ErrorRetry noMargin retry={() => refetch()}>
                DockerStacks could not load
            </ErrorRetry>
        );
    }

    const stacks = data ?? [];
    const stacks1 = stacks.slice(0, Math.ceil(stacks.length / 2));
    const stacks2 = stacks.slice(Math.ceil(stacks.length / 2));

    return (
        <>
            <LoadingDot isLoading={isLoading || isFetching} noMargin />
            <Grid container gap={0.5}>
                <Grid item xs>
                    {data && (
                        <Stack spacing={0.5}>
                            {stacks1.map((stack) => (
                                <DockerStackItem key={stack.Id} stack={stack} />
                            ))}
                        </Stack>
                    )}
                </Grid>
                <Grid item xs>
                    <Stack spacing={0.5}>
                        {stacks2.map((stack) => (
                            <DockerStackItem key={stack.Id} stack={stack} />
                        ))}
                        {/* {!isOpen && <div>{containerDots}</div>} */}
                    </Stack>
                </Grid>
            </Grid>
            {/* <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ??? more`}
            /> */}
        </>
    );
};

export default DockerStackList;
