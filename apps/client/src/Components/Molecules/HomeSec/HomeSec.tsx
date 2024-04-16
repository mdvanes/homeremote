import { HomesecStatusResponse, TypeF } from "@homeremote/types";
import {
    Icon,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Tooltip,
} from "@mui/material";
import { FC, useEffect, useState } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import CardExpandBar from "../CardExpandBar/CardExpandBar";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
import { logError } from "../LogCard/logSlice";
import SimpleHomeSecListItem from "./SimpleHomeSecListItem";

const statusClass: Record<HomesecStatusResponse["status"] | "Error", string> = {
    Error: "black",
    Disarm: "green",
    "Home Arm 1": "yellow",
};

const typeIcon: Record<TypeF, string> = {
    "Door Contact": "sensor_door",
    "Smoke Detector": "smoking_rooms",
    Keypad: "keyboard",
    IR: "animation",
    "Remote Controller": "settings_remote",
};

const UPDATE_INTERVAL_MS = 120000;

export const HomeSec: FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSkippingBecauseError, setIsSkippingBecauseError] = useState(false);
    const dispatch = useAppDispatch();
    const { data, isLoading, isFetching, isError, error, refetch } =
        useGetHomesecStatusQuery(undefined, {
            pollingInterval: isSkippingBecauseError
                ? undefined
                : UPDATE_INTERVAL_MS,
        });

    useEffect(() => {
        if (error) {
            setIsSkippingBecauseError(true);
            dispatch(logError(`HomeSec failed: ${getErrorMessage(error)}`));
        }
    }, [dispatch, error]);

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

    return (
        <Tooltip title={`HomeSec status: ${data?.status ?? "Error"}`}>
            <List
                component={Paper}
                style={{
                    borderWidth: 1,
                    borderStyle: "solid",
                    borderColor: statusClass[data?.status ?? "Error"],
                }}
            >
                <LoadingDot
                    isLoading={isLoading || isFetching}
                    slowUpdateMs={6000}
                />
                {isError && (
                    <ErrorRetry marginate retry={() => refetch()}>
                        HomeSec could not load
                    </ErrorRetry>
                )}
                {hasNoDevices && (
                    <SimpleHomeSecListItem
                        title="No HomeSec devices found"
                        onClick={() => refetch()}
                    />
                )}
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
                                        <div>{sensor.name}</div>
                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "16px",
                                            }}
                                        >
                                            <div>
                                                {sensor.status}

                                                {sensor.cond_ok === "1" ? (
                                                    <Icon color="success">
                                                        check_circle_outline
                                                    </Icon>
                                                ) : (
                                                    <Icon color="error">
                                                        error_outline
                                                    </Icon>
                                                )}
                                            </div>
                                            <div>{sensor.rssi}</div>
                                        </div>
                                    </div>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
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
