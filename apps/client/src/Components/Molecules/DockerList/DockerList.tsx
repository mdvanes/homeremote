import { FC, useState } from "react";
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
import {
    DockerContainerInfo,
    useGetDockerListQuery,
    useStartDockerMutation,
    useStopDockerMutation,
} from "../../../Services/dockerListApi";
import { Stack } from "@mui/system";

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
