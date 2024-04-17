import { StackItem } from "@homeremote/types";
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
import {
    ToggleArgs,
    useStartStackMutation,
    useStopStackMutation,
} from "../../../Services/stacksApi";
import { FC, useState } from "react";

interface DockerStackItemProps {
    stack: StackItem;
}

export const DockerStackItem: FC<DockerStackItemProps> = ({ stack }) => {
    const [startStack] = useStartStackMutation();
    const [stopStack] = useStopStackMutation();
    const [open, setOpen] = useState(false);
    const { Name, Status, Id, EndpointId } = stack;
    const isUp = Status === 1;
    const state = isUp ? "started" : "stopped";

    const toggleStack = () => {
        const args: ToggleArgs = {
            id: Id.toString(),
            endpointId: EndpointId.toString(),
        };

        if (isUp) {
            stopStack(args);
        } else {
            startStack(args);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Alert
                severity={isUp ? "info" : "error"}
                onClick={() => setOpen(true)}
                sx={{
                    cursor: "pointer",
                }}
            >
                {Name}
            </Alert>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {Name} ({state})
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {/* {state} */}
                        <Typography>
                            Do you want to {isUp ? "stop" : "start"} {Name} ?
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            toggleStack();
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

export default DockerStackItem;
