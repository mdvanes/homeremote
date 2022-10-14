import { Box, Grid, LinearProgress } from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
} from "../../../Services/dockerListApi";
import DockerInfo from "../DockerInfo/DockerInfo";
import DockerListExpandBar from "../DockerListExpandBar/DockerListExpandBar";

const UPDATE_INTERVAL_MS = 30000;

const mapInfo = (c: DockerContainerInfo) => <DockerInfo key={c.Id} info={c} />;

const DockerList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data, isLoading, isFetching } = useGetDockerListQuery(undefined, {
        pollingInterval: UPDATE_INTERVAL_MS,
    });
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
            <DockerListExpandBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                nrOfHidden={allContainers.length - containers.length}
            />
        </>
    );
};

export default DockerList;
