import React, { FC, useEffect } from "react";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { logError } from "../LogCard/logSlice";
import useStyles from "./AppStatusButton.styles";
import { AppStatusState, getAppStatus } from "./appStatusSlice";

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
        if (errorMessage) {
            dispatch(logError(errorMessage));
        }
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
