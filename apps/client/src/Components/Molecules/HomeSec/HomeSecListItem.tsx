import { HomesecStatusResponse } from "@homeremote/types";
import {
    Icon,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";
import { ConditionIcon } from "./ConditionIcon";
import { typeIcon } from "./HomeSecMaps";
import { RssiIcon } from "./RssiIcon";

export const HomeSecListItem: FC<{
    sensor: HomesecStatusResponse["devices"][number];
}> = ({ sensor }) => {
    return (
        <ListItem key={sensor.id} disableGutters disablePadding dense>
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
                                {sensor.name === "" && sensor.type_f === "Siren"
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
                                    <ConditionIcon cond_ok={sensor.cond_ok} />
                                </div>
                                <div>
                                    <RssiIcon rssi={sensor.rssi} />
                                </div>
                            </div>
                        </div>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
};
