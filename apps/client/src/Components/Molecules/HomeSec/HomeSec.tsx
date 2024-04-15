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
import { FC } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";
import ErrorRetry from "../ErrorRetry/ErrorRetry";
import LoadingDot from "../LoadingDot/LoadingDot";
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

export const HomeSec: FC = () => {
    const { data, isLoading, isFetching, isError, refetch } =
        useGetHomesecStatusQuery(undefined);

    const hasNoDevices =
        !isError &&
        !isLoading &&
        !isFetching &&
        (!data?.devices || data?.devices.length === 0);

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
                <LoadingDot isLoading={isLoading || isFetching} />
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
                {data?.devices?.map((sensor) => (
                    <ListItem
                        key={sensor.id}
                        disableGutters
                        disablePadding
                        dense
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Icon>{typeIcon[sensor.type_f]}</Icon>
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
                                            <div>{sensor.status}</div>
                                            <div>{sensor.rssi}</div>
                                        </div>
                                    </div>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Tooltip>
    );
};

export default HomeSec;
