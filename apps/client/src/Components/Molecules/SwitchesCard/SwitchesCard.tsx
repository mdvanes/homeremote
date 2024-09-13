import { List, Paper } from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetSmartEntitiesQuery } from "../../../Services/generated/smartEntitiesApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import { ClimateSensorsListItem } from "./ClimateSensorsListItem";
import { SwitchesListItem } from "./SwitchesListItem";
import { isClimateSensor, isSwitch, sortClimateSensors } from "./utils";

const UPDATE_INTERVAL_MS = 1_000 * 60; // 1000 ms / 60 seconds = 1x per minute

export const SwitchesCard: FC = () => {
    const dispatch = useAppDispatch();
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);

    const { data, error, isError, isFetching, isLoading, refetch } =
        useGetSmartEntitiesQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    const switches = (data?.entities ?? []).filter(isSwitch);

    const climateSensors = (data?.entities ?? [])
        .filter(isClimateSensor)
        .toSorted(sortClimateSensors);

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
            {isError && (
                <ErrorRetry retry={() => refetch()}>
                    SwitchesCard could not load
                </ErrorRetry>
            )}
            {switches.map((item) => (
                <SwitchesListItem key={item.entity_id} item={item} />
            ))}
            {/* TODO extract to own card */}
            <ClimateSensorsListItem sensors={climateSensors} />
        </List>
    );
};
