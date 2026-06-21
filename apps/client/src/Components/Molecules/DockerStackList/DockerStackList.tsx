import { Grid, Stack } from "@mui/material";
import { FC } from "react";
import { useGetStacksQuery } from "../../../Services/stacksApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import DockerStackItem from "./DockerStackItem";

const UPDATE_INTERVAL_MS = 30000;

export const DockerStackList: FC = () => {
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetStacksQuery, undefined, {
        name: "Docker stacks",
        pollingInterval: UPDATE_INTERVAL_MS,
    });

    const stacks = data ?? [];
    const stacks1 = stacks.slice(0, Math.ceil(stacks.length / 2));
    const stacks2 = stacks.slice(Math.ceil(stacks.length / 2));

    return (
        <>
            <CardStatusBar
                isLoading={(isLoading || isFetching) && !isError}
                name="Docker stacks"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
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
