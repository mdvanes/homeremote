import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import { FC, useState } from "react";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
    useStartDockerMutation,
    useStopDockerMutation,
} from "../../../Services/dockerListApi";
import DockerListExpandBar from "../DockerListExpandBar/DockerListExpandBar";

const DockerInfo: FC<{ info: DockerContainerInfo }> = ({ info }) => {
    const [startDocker] = useStartDockerMutation();
    const [stopDocker] = useStopDockerMutation();
    const { Names, Status, Id, State } = info;
    const isUp = Status.indexOf("Up") === 0;

    const toggleContainer = () => {
        if (isUp) {
            stopDocker({ id: Id });
        } else {
            startDocker({ id: Id });
        }
    };

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const name = Names.map((n) => n.slice(1)).join(", ");

    return (
        <>
            <Alert severity={isUp ? "info" : "error"} onClick={handleClickOpen}>
                {name} | {Status}
            </Alert>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {name} ({State})
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {Status}
                        <Typography>
                            Do you want to {isUp ? "stop" : "start"} {name} ?
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            toggleContainer();
                            handleClose();
                        }}
                        autoFocus
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const mapInfo = (c: DockerContainerInfo) => <DockerInfo key={c.Id} info={c} />;

const DockerList: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data } = useGetDockerListQuery({});
    if (data?.status !== "received") {
        return <></>;
    }
    const allContainers = data.containers ?? [];
    const notRunningContainers = (data.containers ?? []).filter(
        (c) => c.State !== "running"
    );
    const containers = isOpen ? allContainers : notRunningContainers;
    const containers1 = containers.slice(0, containers.length / 2);
    const containers2 = containers.slice(containers.length / 2);

    // TODO add polling

    return (
        <>
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
