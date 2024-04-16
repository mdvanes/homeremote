import { DockerContainerInfo } from "@homeremote/types";
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from "@mui/material";
import { FC, useState } from "react";
import {
    useStartDockerMutation,
    useStopDockerMutation,
} from "../../../Services/dockerListApi";

const DockerInfo: FC<{ info: DockerContainerInfo }> = ({ info }) => {
    const [startDocker] = useStartDockerMutation();
    const [stopDocker] = useStopDockerMutation();
    const { Names, Status, Id, State, Labels } = info;
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
            <Alert
                severity={isUp ? "info" : "error"}
                onClick={handleClickOpen}
                sx={{
                    cursor: "pointer",
                }}
            >
                {name}{" "}
                {Labels["com.docker.compose.project"]
                    ? `(${Labels["com.docker.compose.project"]})`
                    : ""}{" "}
                | {Status}
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

export default DockerInfo;
