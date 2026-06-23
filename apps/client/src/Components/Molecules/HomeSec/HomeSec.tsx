import { Box, List, Paper, Tooltip } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { FC, useEffect, useState } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import { staleContentSx } from "../CardStatus/CardStatus";
import CardStatusBar from "../CardStatusBar/CardStatusBar";
import { logError, logInfo } from "../LogCard/logSlice";
import { HomeSecListItem } from "./HomeSecListItem";
import { statusClass } from "./HomeSecMaps";
import SimpleHomeSecListItem from "./SimpleHomeSecListItem";

const UPDATE_INTERVAL_MS = 2 * 60 * 1000;

const isApiUnimplemented = (error?: FetchBaseQueryError | SerializedError) =>
    error && "status" in error && error.status === 501;

export const HomeSec: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isFeatureDisabled, setIsFeatureDisabled] = useState(false);
    const dispatch = useAppDispatch();
    const {
        data,
        isLoading,
        isFetching,
        isError,
        isStale,
        lastUpdated,
        retry,
    } = usePolledQuery(useGetHomesecStatusQuery, undefined, {
        name: "HomeSec",
        pollingInterval: UPDATE_INTERVAL_MS,
        queryOptions: { skip: isFeatureDisabled },
        onError: (message, error) => {
            if (isApiUnimplemented(error)) {
                setIsFeatureDisabled(true);
                return;
            }
            dispatch(logError(`HomeSec failed: ${message}`));
        },
    });

    // TODO logInfo when data.status changes. Does this work?
    useEffect(() => {
        dispatch(logInfo(`HomeSec status: ${data?.status}`));
    }, [data?.status, dispatch]);

    const hasNoDevices =
        !isError &&
        !isLoading &&
        !isFetching &&
        (!data?.devices || data?.devices.length === 0);

    const devices = data?.devices ?? [];

    // By default, only show doors
    const shownDevices = isOpen
        ? devices
        : devices.filter(({ type_f }) => type_f === "Door Contact");

    if (isFeatureDisabled) {
        return null;
    }

    return (
        <Tooltip title={`HomeSec status: ${data?.status ?? "Error"}`}>
            <List
                component={Paper}
                onClick={() => retry()}
                sx={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: statusClass[data?.status ?? "Error"],
                    position: "relative",
                }}
            >
                <CardStatusBar
                    isLoading={(isLoading || isFetching) && !isError}
                    name="HomeSec"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                    slowUpdateMs={6000}
                />
                {hasNoDevices && (
                    <SimpleHomeSecListItem
                        title="No HomeSec devices found"
                        onClick={() => retry()}
                    />
                )}
                <Box sx={staleContentSx(isStale)}>
                    {shownDevices.map((sensor) => (
                        <HomeSecListItem key={sensor.id} sensor={sensor} />
                    ))}
                </Box>
                {devices.length > 0 && (
                    <CardExpandBar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        hint={`and ${devices.length - shownDevices.length} more`}
                    />
                )}
            </List>
        </Tooltip>
    );
};

export default HomeSec;
