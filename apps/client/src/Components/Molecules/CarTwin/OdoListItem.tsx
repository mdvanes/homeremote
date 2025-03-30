import { CarTwinResponse } from "@homeremote/types";
import { Tag as TagIcon } from "@mui/icons-material";
import {
    Alert,
    ListItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import { FC } from "react";

export const OdoListItem: FC<{
    odometer: CarTwinResponse["connected"]["odometer"];
    // handleAuthConnected: () => void;
}> = ({
    odometer,
    // , handleAuthConnected
}) => {
    return (
        <>
            {!odometer || odometer === "ERROR" ? (
                <Alert
                    severity="warning"
                    // onClick={handleAuthConnected}
                >
                    Odometer failed: authenticate connected vehicle
                </Alert>
            ) : (
                <ListItem
                //             secondaryAction={
                //                 <Tooltip
                //                     title="NOTE: This number is multiplied by 10 as a
                // correction, and should be accurate to 10 km
                // instead 1 km."
                //                 >
                //                     <InfoIcon />
                //                 </Tooltip>
                //             }
                >
                    <ListItemIcon>
                        <Tooltip title="odometer">
                            <TagIcon />
                        </Tooltip>
                    </ListItemIcon>
                    <ListItemText
                        primary={
                            <>
                                {/* {parseInt(odometer.value ?? "", 10) * 10}{" "} */}
                                {parseInt(odometer.value ?? "", 10)}{" "}
                                {odometer.unit === "kilometers"
                                    ? "km"
                                    : odometer.unit}{" "}
                            </>
                        }
                    />
                </ListItem>
            )}
        </>
    );
};
