import React, { FC, useState, useEffect } from "react";
import { Snackbar, makeStyles, Grid, IconButton } from "@material-ui/core";
import { Warning, Close } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { LogState } from "../Log/logSlice";

const useStyles = makeStyles(() => ({
    root: {
        background: "red",
    },
}));

/** Show a Snackbar for new error messages */
const GlobalSnackbar: FC = ({ children }) => {
    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const handleClose = (): void => setIsOpen(false);
    const urgentMessage: LogState["urgentMessage"] = useSelector<
        RootState,
        LogState["urgentMessage"]
    >((state: RootState) => state.loglinesNew.urgentMessage);
    useEffect(() => {
        if (urgentMessage) {
            setMessage(urgentMessage);
            setIsOpen(true);
        }
    }, [urgentMessage]);
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={300000}
            message={
                <Grid container direction="row" alignItems="center" justify="space-around">
                    <Grid item>
                        <Warning />
                    </Grid>
                    <Grid item style={{ marginLeft: "1rem" }} xs>
                        {message}
                    </Grid>
                    <Grid item>
                        <IconButton onClick={handleClose} color="inherit">
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>
            }
            open={isOpen}
            onClose={handleClose}
            ContentProps={{
                classes: {
                    root: classes.root,
                },
            }}
        />
    );
};

export default GlobalSnackbar;
