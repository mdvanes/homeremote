import { Alert, Box, Grid, LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useEffect, useState } from "react";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
} from "../../../Services/dockerListApi";
import DockerInfo from "../DockerInfo/DockerInfo";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";

const UPDATE_INTERVAL_MS = 30000;

const mapInfo = (c: DockerContainerInfo) => <DockerInfo key={c.Id} info={c} />;

interface DockerListProps {
    onError: (err: string) => void;
}

const getErrorMessage = (
    error: FetchBaseQueryError | SerializedError
): string => {
    if ("error" in error) {
        return error.error;
    }
    if ("message" in error) {
        return `${error.name} ${error.message}`;
    }
    return "Unexpected error";
};

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
    const notRunningContainers = (data.containers ?? []).filter(
        (c) => c.State !== "running"
    );
    const containers = isOpen ? allContainers : notRunningContainers;
    const containers1 = containers.slice(0, containers.length / 2);
    const containers2 = containers.slice(containers.length / 2);

    const loadProgress =
        isLoading || isFetching ? (
            <Box sx={{ position: "absolute" }}>
                <LinearProgress variant="indeterminate" style={{ width: 4 }} />
            </Box>
        ) : (
            " "
        );

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
            <CardExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                hint={`and ${allContainers.length - containers.length} running`}
            />
        </>
    );
};

export default DockerList;
