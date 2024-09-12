import { List, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetSwitchesQuery } from "../../../Services/generated/switchesApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import { SwitchesListItem } from "./SwitchesListItem";

const UPDATE_INTERVAL_MS = 1_000 * 60; // 1000 ms / 60 seconds = 1x per minute

export const SwitchesCard: FC = () => {
    const dispatch = useAppDispatch();
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);

    const { data, error, isError, isFetching, isLoading } = useGetSwitchesQuery(
        undefined,
        {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        }
    );

    useEffect(() => {
        if (isError && error) {
            setIsSkippingBecauseError(true);
            dispatch(
                logError(`SwitchesCard failed: ${getErrorMessage(error)}`)
            );
        }
    }, [dispatch, error, isError]);

    return (
        <List component={Paper}>
            <LoadingDot isLoading={isLoading || isFetching} />
            {(data?.switches ?? []).map((item) => (
                <SwitchesListItem key={item.entity_id} item={item} />
            ))}
        </List>
    );
};
