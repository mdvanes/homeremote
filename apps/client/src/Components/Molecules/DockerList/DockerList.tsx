import { DockerContainerUIInfo } from "@homeremote/types";
import { Box, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useEffect, useState } from "react";
import { useGetDockerListQuery } from "../../../Services/dockerListApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import DockerInfo from "../DockerInfo/DockerInfo";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import ContainerDot from "./ContainerDot";

const UPDATE_INTERVAL_MS = 30000;

const mapInfo = (c: DockerContainerUIInfo) => (
    <DockerInfo key={c.Id} info={c} />
);

const sortContainers = (
    container1: DockerContainerUIInfo,
    container2: DockerContainerUIInfo
): number => {
    if (container1.State === "running" && container2.State !== "running") {
        return -1;
    }
    if (container1.State !== "running" && container2.State === "running") {
        return 1;
    }

    if (container1.Names[0] < container2.Names[0]) {
        return -1;
    }
    if (container1.Names[0] > container2.Names[0]) {
        return 1;
    }
    return 0;
};

interface DockerListProps {
    onError: (err: string) => void;
}

const DockerList: FC<DockerListProps> = ({ onError }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const { data, isLoading, isFetching, error, refetch } =
        useGetDockerListQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    useEffect(() => {
        if (error) {
            setIsSkippingBecauseError(true);
            onError(getErrorMessage(error));
        }
    }, [error, onError]);

    if (error) {
        return (
            <ErrorRetry noMargin retry={() => refetch()}>
                DockerList could not load
            </ErrorRetry>
        );
    }

    if (data?.status !== "received") {
        return null;
    }

    const allContainers = (data.containers ?? []).toSorted(sortContainers);
    const isPrimaryContainer = (c: DockerContainerUIInfo) =>
        typeof c.icon !== "undefined";

    const primaryContainers = allContainers.filter(isPrimaryContainer);
    const secondaryContainers = allContainers.filter(
        (c) => !isPrimaryContainer(c)
    );
    const containerDots = secondaryContainers.map((c) => (
        <ContainerDot key={c.Id} info={c} />
    ));
    const containers = isOpen ? allContainers : primaryContainers;
    const containers1 = containers.slice(0, Math.ceil(containers.length / 2));
    const containers2 = containers.slice(Math.ceil(containers.length / 2));

    return (
        <>
            <LoadingDot isLoading={isLoading || isFetching} noMargin />
            <>
                {!isOpen && containers.length === 0 && (
                    <Box sx={{ marginRight: 1, display: "inline-block" }}>
                        No stopped containers
                    </Box>
                )}
            </>
            <Grid container gap={0.5}>
                <Grid item xs>
                    <Stack spacing={0.5}>{containers1.map(mapInfo)}</Stack>
                </Grid>
                <Grid item xs>
                    <Stack spacing={0.5}>
                        {containers2.map(mapInfo)}
                        {!isOpen && <div>{containerDots}</div>}
                    </Stack>
                </Grid>
            </Grid>
            <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ${allContainers.length - containers.length} more`}
            />
        </>
    );
};

export default DockerList;
