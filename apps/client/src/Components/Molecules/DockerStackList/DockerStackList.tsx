import { Grid, Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetStacksQuery } from "../../../Services/stacksApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import DockerStackItem from "./DockerStackItem";

const UPDATE_INTERVAL_MS = 30000;

export const DockerStackList: FC = () => {
    // const [isOpen, setIsOpen] = useState(false);
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
                                <DockerStackItem stack={stack} />
                            ))}
                        </Stack>
                    )}
                </Grid>
                <Grid item xs>
                    <Stack spacing={0.5}>
                        {stacks2.map((stack) => (
                            <DockerStackItem stack={stack} />
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
