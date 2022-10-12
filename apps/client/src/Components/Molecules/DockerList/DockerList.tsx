import { FC } from "react";
import { Alert, Grid, Typography } from "@mui/material";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
} from "../../../Services/dockerListApi";
import { Stack } from "@mui/system";

const mapInfo = ({ Names, Status, Id }: DockerContainerInfo) => (
    <div
        id={Id}
        onClick={() => {
            console.log(`click ${Id}`);
        }}
    >
        <Alert severity={Status.indexOf("Up") === 0 ? "info" : "error"}>
            {Status}
        </Alert>
        <Typography>{Names.map((n) => n.slice(1)).join(", ")}</Typography>
    </div>
);

const DockerList: FC = () => {
    const { data } = useGetDockerListQuery({});
    if (data?.status !== "received") {
        return <></>;
    }
    const containers = data.containers ?? [];
    const containers1 = containers.slice(0, containers.length / 2);
    const containers2 = containers.slice(containers.length / 2);
    return (
        <Grid container gap={4}>
            <Grid item xs>
                <Stack spacing={2}>{containers1.map(mapInfo)}</Stack>
            </Grid>
            <Grid item xs>
                <Stack spacing={2}>{containers2.map(mapInfo)}</Stack>
            </Grid>
        </Grid>
    );
};

export default DockerList;
