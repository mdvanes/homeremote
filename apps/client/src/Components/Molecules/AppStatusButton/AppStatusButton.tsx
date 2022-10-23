import React, { FC, useEffect } from "react";
import { Button } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { logError } from "../LogCard/logSlice";
import { AppStatusState, getAppStatus } from "./appStatusSlice";
import { styled } from "@mui/material/styles";
import { useAppDispatch } from "../../../store";

const DarkButton = styled(Button)(
    ({ theme }) => `
    background-color: ${theme.palette.primary.dark};

    :hover {
        background-color: ${theme.palette.primary.light};
    }
`
);

const AppStatusButton: FC = () => {
    const dispatch = useAppDispatch();

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
        <DarkButton
            variant="contained"
            size="small"
            onClick={handleClick}
            disableElevation
        >
            {status}
        </DarkButton>
    );
};

export default AppStatusButton;
