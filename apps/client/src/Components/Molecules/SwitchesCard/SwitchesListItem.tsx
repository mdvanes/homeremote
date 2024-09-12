import {
    RadioButtonChecked as RadioButtonCheckedIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FC } from "react";
import {
    Switch,
    useUpdateHaSwitchMutation,
} from "../../../Services/generated/switchesApi";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import { logError } from "../LogCard/logSlice";
import { SwitchesListItemButton } from "./SwitchesListItemButton";

interface SwitchesListItemProps {
    item: Switch;
}

export const SwitchesListItem: FC<SwitchesListItemProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const [updateSwitch] = useUpdateHaSwitchMutation();

    const setState = (state: "On" | "Off") => async () => {
        try {
            if (item.entity_id) {
                await updateSwitch({
                    entityId: item.entity_id,
                    body: { state },
                });
            }
        } catch (error) {
            dispatch(
                logError(
                    `SwitchesListItem failed: ${getErrorMessage(
                        error as SerializedError
                    )}`
                )
            );
        }
    };

    return (
        <ListItem disableGutters disablePadding>
            <SwitchesListItemButton
                onClick={setState("On")}
                selected={item.state === "on"}
            >
                <RadioButtonCheckedIcon />
            </SwitchesListItemButton>
            <ListItemText
                sx={{ flex: 1, paddingX: 1 }}
                primary={item.attributes?.friendly_name}
                // secondary={
                //     <>
                //         {item.state}
                //         {/* {ParentIndexNumber}x{IndexNumber}{" "}
                //             <strong>{SeriesName} </strong>
                //             {ProductionYear && ` (${ProductionYear}) `} */}
                //     </>
                // }
            />
            <SwitchesListItemButton
                onClick={setState("Off")}
                selected={item.state === "off"}
            >
                <RadioButtonUncheckedIcon />
            </SwitchesListItemButton>
        </ListItem>
    );
};
