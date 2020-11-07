import { Button, makeStyles } from "@material-ui/core";
import React, { FC } from "react";


const useStyles = makeStyles(({ palette }) => ({
    root: {
        backgroundColor: palette.primary.dark,
        maxWidth: "120px",
        maxHeight: "2.5rem",
        "&:hover": {
            backgroundColor: palette.primary.light,
        }
    },
    label: {
        fontSize: "80%",
    },
}));

const AppStatusButton: FC = () => {
    const classes = useStyles();

    return (
        <Button classes={classes} color="inherit">
            Tabcdafa Esafassa
        </Button>
    );
};

export default AppStatusButton;
