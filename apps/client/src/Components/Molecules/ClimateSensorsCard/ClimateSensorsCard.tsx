import { List, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetSmartEntitiesQuery } from "../../../Services/generated/smartEntitiesApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import { isClimateSensor, sortClimateSensors } from "../SwitchesCard/utils";
import { ClimateSensorsListItem } from "./ClimateSensorsListItem";

const UPDATE_INTERVAL_MS = 1_000 * 60 * 1.5; // 1000 ms / 60 seconds = 1x per 1.5 minutes (to prevent synching with SwitchesCard)

export const ClimateSensorsCard: FC = () => {
    const dispatch = useAppDispatch();
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);

    const { data, error, isError, isFetching, isLoading, refetch } =
        useGetSmartEntitiesQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    const climateSensors = (data?.entities ?? [])
        .filter(isClimateSensor)
        .toSorted(sortClimateSensors);

    useEffect(() => {
        if (isError && error) {
            setIsSkippingBecauseError(true);
            dispatch(
                logError(`ClimateSensorsCard failed: ${getErrorMessage(error)}`)
            );
        }
    }, [dispatch, error, isError]);

    return (
        <List component={Paper}>
            <LoadingDot isLoading={isLoading || isFetching} />
            {isError && (
                <ErrorRetry retry={() => refetch()}>
                    ClimateSensorsCard could not load
                </ErrorRetry>
            )}
            <ClimateSensorsListItem sensors={climateSensors} />
        </List>
    );
};
