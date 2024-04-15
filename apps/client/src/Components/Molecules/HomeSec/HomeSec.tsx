import { FC } from "react";
import { useGetHomesecStatusQuery } from "../../../Services/homesecApi";
import {
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    Icon,
} from "@mui/material";
import { HomesecStatusResponse, TypeF } from "@homeremote/types";
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

    return (
        <List
            component={Paper}
            style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: statusClass[data?.status ?? "Error"],
            }}
        >
            <LoadingDot isLoading={isLoading || isFetching} />
            {isError ? (
                <SimpleHomeSecListItem
                    title="Error retrieving devices"
                    onClick={() => refetch()}
                />
            ) : (
                ""
            )}
            {!data?.devices || data?.devices.length === 0 ? (
                <SimpleHomeSecListItem
                    title="No devices found"
                    onClick={() => refetch()}
                />
            ) : (
                ""
            )}
            {data?.devices?.map((sensor) => (
                <ListItem disableGutters disablePadding dense>
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
    );
};

export default HomeSec;
