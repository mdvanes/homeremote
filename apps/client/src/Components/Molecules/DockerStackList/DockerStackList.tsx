import { Grid, Stack } from "@mui/material";
import { FC } from "react";
import { BACKOFF_DELAY, useGetStacksQuery } from "../../../Services/stacksApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import LoadingDot from "../LoadingDot/LoadingDot";
import DockerStackItem from "./DockerStackItem";

export const DockerStackList: FC = () => {
    const { data, isLoading, isFetching, isError, isStale, retry } =
        usePolledQuery(useGetStacksQuery, undefined, {
            name: "Docker stacks",
            pollingInterval: BACKOFF_DELAY,
        });

    const stacks = data ?? [];
    const stacks1 = stacks.slice(0, Math.ceil(stacks.length / 2));
    const stacks2 = stacks.slice(Math.ceil(stacks.length / 2));

    return (
        <>
            <LoadingDot isLoading={isLoading || isFetching} noMargin />
            <CardStatus
                name="Docker stacks"
                isError={isError}
                isStale={isStale}
                retry={retry}
                noMargin
            />
            <Grid
                container
                sx={{
                    gap: 0.5,
                    ...staleContentSx(isStale),
                }}
            >
                <Grid size="grow">
                    {data && (
                        <Stack spacing={0.5}>
                            {stacks1.map((stack) => (
                                <DockerStackItem key={stack.Id} stack={stack} />
                            ))}
                        </Stack>
                    )}
                </Grid>
                <Grid size="grow">
                    <Stack spacing={0.5}>
                        {stacks2.map((stack) => (
                            <DockerStackItem key={stack.Id} stack={stack} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>
        </>
    );
};

export default DockerStackList;
