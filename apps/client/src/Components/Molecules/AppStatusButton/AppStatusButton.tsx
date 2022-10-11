import React, { FC, useEffect } from "react";
import { Button, colors } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { logError } from "../LogCard/logSlice";
import { AppStatusState, getAppStatus } from "./appStatusSlice";
import { styled } from "@mui/material/styles";

const DarkButton = styled(Button)(
    ({ theme }) => `
    background-color: ${theme.palette.primary.dark};

    :hover {
        background-color: ${theme.palette.primary.light};
    }
`
);

const AppStatusButton: FC = () => {
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
