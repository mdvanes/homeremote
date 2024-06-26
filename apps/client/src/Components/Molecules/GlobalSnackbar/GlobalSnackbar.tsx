import { Close, Warning } from "@mui/icons-material";
import { Grid, IconButton, Snackbar } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "tss-react/mui";
import { RootState } from "../../../Reducers";
import { LogState, Severity } from "../LogCard/logSlice";

const useStyles = makeStyles()((theme) => ({
    error: {
        background: theme.palette.error.dark,
    },
    info: {
        background: theme.palette.info.dark,
    },
    message: {
        width: "100%",
    },
}));

/** Show a Snackbar for new error messages */
const GlobalSnackbar: FC = () => {
    const { classes } = useStyles();
    const [isOpen, setIsOpen] = useState(false);
    const [line, setLine] = useState<LogState["urgentMessage"]>(false);
    const handleClose = (): void => setIsOpen(false);
    const urgentMessage: LogState["urgentMessage"] = useSelector<
        RootState,
        LogState["urgentMessage"]
    >((state: RootState) => state.loglines.urgentMessage);

    useEffect(() => {
        if (urgentMessage) {
            setLine(urgentMessage);
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
                        {line && line.message}
                    </Grid>
                    <Grid item>
                        <IconButton
                            onClick={handleClose}
                            color="inherit"
                            size="large"
                        >
                            <Close />
                        </IconButton>
                    </Grid>
                </Grid>
            }
            open={isOpen}
            onClose={handleClose}
            ContentProps={{
                classes: {
                    root:
                        line && line.severity === Severity.ERROR
                            ? classes.error
                            : classes.info,
                    message: classes.message,
                },
            }}
        />
    );
};

export default GlobalSnackbar;
