import { Alert, Box, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useEffect, useState } from "react";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
} from "../../../Services/dockerListApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import DockerInfo from "../DockerInfo/DockerInfo";
import LoadingDot from "../LoadingDot/LoadingDot";

const UPDATE_INTERVAL_MS = 30000;

const mapInfo = (c: DockerContainerInfo) => <DockerInfo key={c.Id} info={c} />;

interface DockerListProps {
    onError: (err: string) => void;
}

const ContainerDot: FC<{ info: DockerContainerInfo }> = ({ info }) => (
    <Box
        title={info.Names.join(",")}
        sx={{
            display: "inline-block",
            width: 8,
            height: 8,
            backgroundColor: "#29b6f6",
            marginRight: 0.25,
            borderRadius: "50%",
        }}
    ></Box>
);

const DockerList: FC<DockerListProps> = ({ onError }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading, isFetching, error } = useGetDockerListQuery(
        undefined,
        {
            pollingInterval: UPDATE_INTERVAL_MS,
        }
    );

    useEffect(() => {
        if (error) {
            onError(getErrorMessage(error));
        }
    }, [error, onError]);

    if (error) {
        return <Alert severity="error">{getErrorMessage(error)}</Alert>;
    }

    if (data?.status !== "received") {
        return null;
    }

    const allContainers = data.containers ?? [];
    const runningContainers = (data.containers ?? []).filter(
        (c) => c.State === "running"
    );
    const notRunningContainers = (data.containers ?? []).filter(
        (c) => c.State !== "running"
    );
    const containers = isOpen ? allContainers : notRunningContainers;
    const containers1 = containers.slice(0, containers.length / 2);
    const containers2 = containers.slice(containers.length / 2);

    const loadProgress = isLoading || isFetching ? <LoadingDot /> : " ";

    const containerDots = runningContainers.map((c) => (
        <ContainerDot info={c} />
    ));

    return (
        <>
            {loadProgress}
            <Grid container gap={0.5}>
                <Grid item xs>
                    <Stack spacing={0.5}>{containers1.map(mapInfo)}</Stack>
                </Grid>
                <Grid item xs>
                    <Stack spacing={0.5}>{containers2.map(mapInfo)}</Stack>
                </Grid>
            </Grid>
            <>
                {!isOpen && containers.length === 0 && (
                    <Box sx={{ marginRight: 1, display: "inline-block" }}>
                        No stopped containers
                    </Box>
                )}
                {!isOpen && <>{containerDots}</>}
            </>
            <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ${allContainers.length - containers.length} running`}
            />
        </>
    );
};

export default DockerList;
