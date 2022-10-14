import { FC, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import {
    DockerContainerInfo,
    useGetDockerListQuery,
    useStartDockerMutation,
    useStopDockerMutation,
} from "../../../Services/dockerListApi";
import { Stack } from "@mui/system";
import { ArrowDropUp, ArrowDropDown } from "@mui/icons-material";

interface DockerListExpandBarProps {
    isOpen: boolean;
    setIsOpen: (_: boolean) => void;
    nrOfHidden: number;
}

const DockerListExpandBar: FC<DockerListExpandBarProps> = ({
    isOpen,
    setIsOpen,
    nrOfHidden,
}) => {
    return (
        <Grid container justifyContent="flex-end">
            <Grid item>
                {!isOpen ? (
                    <span>
                        {/* and {allContainers.length - containers.length} running{" "} */}
                        and {nrOfHidden} running{" "}
                        <IconButton
                            aria-label="up"
                            size="small"
                            onClick={() => setIsOpen(true)}
                        >
                            <ArrowDropDown />
                        </IconButton>
                    </span>
                ) : (
                    <IconButton
                        aria-label="up"
                        size="small"
                        onClick={() => setIsOpen(false)}
                    >
                        <ArrowDropUp />
                    </IconButton>
                )}
            </Grid>
        </Grid>
    );
};

export default DockerListExpandBar;
