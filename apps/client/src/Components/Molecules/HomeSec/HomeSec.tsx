import { HomesecStatusResponse, TypeF } from "@homeremote/types";
import {
    Box,
    Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Tooltip,
} from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { FC, useEffect, useState } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";
import { usePolledQuery } from "../../../Utils/usePolledQuery";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import CardStatus, { staleContentSx } from "../CardStatus/CardStatus";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError, logInfo } from "../LogCard/logSlice";
import { RssiIcon } from "./RssiIcon";
import SimpleHomeSecListItem from "./SimpleHomeSecListItem";

const statusClass: Record<HomesecStatusResponse["status"] | "Error", string> = {
    Error: "black",
    Disarm: "green",
    "Home Arm 1": "yellow",
    "Full Arm": "red",
};

const typeIcon: Record<TypeF, string> = {
    "Door Contact": "sensor_door",
    "Smoke Detector": "smoking_rooms",
    Keypad: "keyboard",
    IR: "animation",
    "Remote Controller": "settings_remote",
    Siren: "notifications",
    CO: "smoking_rooms",
};

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
                style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: statusClass[data?.status ?? "Error"],
                }}
            >
                <LoadingDot
                    isLoading={(isLoading || isFetching) && !isError}
                    slowUpdateMs={6000}
                />
                <CardStatus
                    name="HomeSec"
                    isError={isError}
                    isStale={isStale}
                    retry={retry}
                    lastUpdated={lastUpdated}
                />
                {hasNoDevices && (
                    <SimpleHomeSecListItem
                        title="No HomeSec devices found"
                        onClick={() => retry()}
                    />
                )}
                <Box sx={staleContentSx(isStale)}>
                    {shownDevices.map((sensor) => (
                        <ListItem
                            key={sensor.id}
                            disableGutters
                            disablePadding
                            dense
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <Tooltip title={sensor.type_f}>
                                        <Icon>{typeIcon[sensor.type_f]}</Icon>
                                    </Tooltip>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={
                                        <div
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div>
                                                {sensor.name === "" &&
                                                sensor.type_f === "Siren"
                                                    ? "Sirene"
                                                    : sensor.name}
                                            </div>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                }}
                                            >
                                                <div>{sensor.status}</div>
                                                <div>
                                                    {sensor.cond_ok === "1" ? (
                                                        <Icon
                                                            color="success"
                                                            sx={{
                                                                marginTop:
                                                                    "-0.1rem",
                                                            }}
                                                        >
                                                            check_circle_outline
                                                        </Icon>
                                                    ) : (
                                                        <Icon
                                                            color="error"
                                                            sx={{
                                                                marginTop:
                                                                    "-0.1rem",
                                                            }}
                                                        >
                                                            error_outline
                                                        </Icon>
                                                    )}
                                                </div>
                                                <div>
                                                    <RssiIcon
                                                        rssi={sensor.rssi}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </Box>
                {devices.length > 0 && (
                    <CardExpandBar
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        hint={`and ${
                            devices.length - shownDevices.length
                        } more`}
                    />
                )}
            </List>
        </Tooltip>
    );
};

export default HomeSec;
