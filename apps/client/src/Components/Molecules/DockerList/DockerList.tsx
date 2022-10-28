import { Alert, Grid } from "@mui/material";
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

    const loadProgress = isLoading || isFetching ? <LoadingDot /> : " ";

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
