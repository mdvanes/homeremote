import { DockerContainerUIInfo } from "@homeremote/types";
import { Box, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import { useGetDockerListQuery } from "../../../Services/dockerListApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import DockerInfo from "../DockerInfo/DockerInfo";
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
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetDockerListQuery, undefined, {
        name: "Docker",
        pollingInterval: UPDATE_INTERVAL_MS,
        onError,
    });

    const allContainers =
        data?.status === "received"
            ? (data.containers ?? []).toSorted(sortContainers)
            : [];
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
            <LoadingDot
                isLoading={(isLoading || isFetching) && !isError}
                noMargin
            />
            <CardStatus
                name="Docker"
                isError={isError}
                isStale={isStale}
                retry={retry}
                lastUpdated={lastUpdated}
                noMargin
            />
            {data?.status === "received" && (
                <Box sx={staleContentSx(isStale)}>
                    <>
                        {!isOpen && containers.length === 0 && (
                            <Box
                                sx={{
                                    marginRight: 1,
                                    display: "inline-block",
                                }}
                            >
                                No stopped containers
                            </Box>
                        )}
                    </>
                    <Grid
                        container
                        sx={{
                            gap: 0.5,
                        }}
                    >
                        <Grid size="grow">
                            <Stack spacing={0.5}>
                                {containers1.map(mapInfo)}
                            </Stack>
                        </Grid>
                        <Grid size="grow">
                            <Stack spacing={0.5}>
                                {containers2.map(mapInfo)}
                                {!isOpen && <div>{containerDots}</div>}
                            </Stack>
                        </Grid>
                    </Grid>
                    <CardExpandBar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        hint={`and ${
                            allContainers.length - containers.length
                        } more`}
                    />
                </Box>
            )}
        </>
    );
};

export default DockerList;
