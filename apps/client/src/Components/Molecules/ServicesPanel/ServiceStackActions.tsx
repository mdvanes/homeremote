import { ServiceStack } from "@homeremote/types";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import StopIcon from "@mui/icons-material/Stop";
import {
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { FC, useState } from "react";
import {
    ServiceAction,
    useControlContainerMutation,
    useControlStackMutation,
} from "../../../Services/servicesApi";

interface ServiceStackActionsProps {
    stack: ServiceStack;
    /** Extra sx for the actions container, e.g. hover reveal. */
    className?: string;
}

export const ServiceStackActions: FC<ServiceStackActionsProps> = ({
    stack,
    className,
}) => {
    const [controlStack] = useControlStackMutation();
    const [controlContainer] = useControlContainerMutation();
    const [pending, setPending] = useState<ServiceAction | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const runAction = async (action: ServiceAction) => {
        setIsLoading(true);
        try {
            if (
                stack.source === "portainer" &&
                stack.endpointId !== undefined
            ) {
                await controlStack({
                    id: stack.Id,
                    endpointId: stack.endpointId,
                    action,
                });
            } else {
                await Promise.all(
                    stack.containers.map((container) =>
                        controlContainer({ id: container.Id, action })
                    )
                );
            }
        } finally {
            setIsLoading(false);
        }
    };

    const confirm = () => {
        if (pending) {
            runAction(pending);
        }
        setPending(null);
    };

    return (
        <>
            <Box
                className={className}
                sx={{
                    display: "flex",
                    gap: 0.25,
                    alignItems: "center",
                    opacity: 0,
                    transition: "opacity 0.12s",
                    "&:focus-within": { opacity: 1 },
                }}
            >
                {isLoading && <CircularProgress size={14} />}
                <IconButton
                    size="small"
                    title="Start"
                    aria-label={`Start ${stack.Name}`}
                    disabled={isLoading}
                    onClick={() => setPending("start")}
                >
                    <PlayArrowIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    title="Stop"
                    aria-label={`Stop ${stack.Name}`}
                    disabled={isLoading}
                    onClick={() => setPending("stop")}
                >
                    <StopIcon fontSize="small" />
                </IconButton>
                <IconButton
                    size="small"
                    title="Restart"
                    aria-label={`Restart ${stack.Name}`}
                    disabled={isLoading}
                    onClick={() => setPending("restart")}
                >
                    <RestartAltIcon fontSize="small" />
                </IconButton>
            </Box>
            <Dialog open={pending !== null} onClose={() => setPending(null)}>
                <DialogTitle>
                    {pending} {stack.Name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Do you want to {pending} {stack.Name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={() => setPending(null)}>
                        Cancel
                    </Button>
                    <Button onClick={confirm} autoFocus>
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ServiceStackActions;
