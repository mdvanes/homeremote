import {
    RadioButtonChecked as RadioButtonCheckedIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import { ListItem, ListItemText } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FC } from "react";
import { useUpdateSmartEntityMutation } from "../../../Services/generated/smartEntitiesApi";
import { State } from "../../../Services/generated/smartEntitiesApiWithRetry";
import { getErrorMessage } from "../../../Utils/getErrorMessage";
import { useAppDispatch } from "../../../store";
import { logError } from "../LogCard/logSlice";
import { SwitchesListItemButton } from "./SwitchesListItemButton";

interface SwitchesListItemProps {
    item: State;
}

export const SwitchesListItem: FC<SwitchesListItemProps> = ({ item }) => {
    const dispatch = useAppDispatch();
    const [updateSwitch, { isLoading }] = useUpdateSmartEntityMutation();

    const setState = (state: "on" | "off") => async () => {
        try {
            if (item.entity_id) {
                await updateSwitch({
                    entityId: item.entity_id,
                    updateSmartEntityBody: { state },
                }).unwrap();
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
                onClick={setState("on")}
                selected={item.state === "on"}
                disabled={isLoading}
            >
                <RadioButtonCheckedIcon />
            </SwitchesListItemButton>
            <ListItemText
                sx={{ flex: 1, paddingX: 1 }}
                primary={
                    (item.attributes?.friendly_name ?? "").length > 0
                        ? item.attributes?.friendly_name
                        : item.entity_id
                }
            />
            <SwitchesListItemButton
                onClick={setState("off")}
                selected={item.state === "off"}
                disabled={isLoading}
            >
                <RadioButtonUncheckedIcon />
            </SwitchesListItemButton>
        </ListItem>
    );
};
