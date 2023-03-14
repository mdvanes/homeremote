import { CarTwinResponse } from "@homeremote/types";
import { Speed as SpeedIcon } from "@mui/icons-material";
import {
    Alert,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";

export const AvgSpeedListItem: FC<{
    statistics: CarTwinResponse["connected"]["statistics"];
    handleAuthConnected: () => void;
}> = ({ statistics, handleAuthConnected }) => {
    return (
        <>
            {/* {!statistics || statistics === "ERROR" ? (
                <Alert severity="warning" onClick={handleAuthConnected}>
                    Statistics failed: authenticate connected vehicle
                </Alert>
            ) : (
                <ListItem>
                    <ListItemIcon>
                        <Tooltip title="TODO">
                            <SpeedIcon />
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                        primary={<>{statistics.averageSpeed?.value} km/hr</>}
                    />
                </ListItem>
            )} */}
        </>
    );
};
