import { ArrowDropDown, ArrowDropUp } from "@mui/icons-material";
import { Grid, IconButton } from "@mui/material";
import { FC } from "react";

interface CardExpandBarProps {
    isOpen: boolean;
    setIsOpen: (_: boolean) => void;
    hint: string;
}

const CardExpandBar: FC<CardExpandBarProps> = ({ isOpen, setIsOpen, hint }) => {
    return (
        <Grid container justifyContent="flex-end">
            <Grid item>
                {!isOpen ? (
                    <span>
                        {hint}
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

export default CardExpandBar;
