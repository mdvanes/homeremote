import { Button, makeStyles } from "@material-ui/core";
import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { logError } from "../LogCard/logSlice";
import { AppStatusState, getAppStatus } from "./appStatusSlice";

const useStyles = makeStyles(({ palette }) => ({
    root: {
        backgroundColor: palette.primary.dark,
        maxWidth: "120px",
        maxHeight: "2.5rem",
        "&:hover": {
            backgroundColor: palette.primary.light,
        },
    },
    label: {
        fontSize: "80%",
    },
}));

const AppStatusButton: FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const status = useSelector<RootState, AppStatusState["status"]>(
        (state: RootState) => state.appStatus.status
    );
    const errorMessage = useSelector<RootState, AppStatusState["error"]>(
        (state: RootState) => state.appStatus.error
    );

    useEffect(() => {
        dispatch(getAppStatus());
    }, [dispatch]);

    useEffect(() => {
        dispatch(logError(errorMessage));
    }, [errorMessage, dispatch]);

    const handleClick = () => {
        dispatch(getAppStatus());
    };

    return (
        <Button classes={classes} color="inherit" onClick={handleClick}>
            {status}
        </Button>
    );
};

export default AppStatusButton;
