import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { FC } from "react";

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
