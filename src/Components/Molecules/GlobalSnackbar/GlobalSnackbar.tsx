import React, { FC, useState, useEffect } from "react";
import { Snackbar, makeStyles, Grid, IconButton } from "@material-ui/core";
import { Warning, Close } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { LogState } from "../LogCard/logSlice";

const useStyles = makeStyles(() => ({
    root: {
        background: "red",
    },
    message: {
        width: "100%",
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
    >((state: RootState) => state.loglines.urgentMessage);
    useEffect(() => {
        if (urgentMessage) {
            setMessage(urgentMessage);
            setIsOpen(true);
        }
    }, [urgentMessage]);
    return (
        <Snackbar
            data-testid="global-snackbar"
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            autoHideDuration={3000}
            message={
                <Grid container direction="row" alignItems="center" spacing={1}>
                    <Grid item>
                        <Warning />
                    </Grid>
                    <Grid item xs>
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
                    message: classes.message,
                },
            }}
        />
    );
};

export default GlobalSnackbar;
