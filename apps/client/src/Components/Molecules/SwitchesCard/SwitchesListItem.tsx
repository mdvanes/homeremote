import {
    RadioButtonChecked as RadioButtonCheckedIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import { ListItem, ListItemText, Slider } from "@mui/material";
import { SerializedError } from "@reduxjs/toolkit";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import {
    UpdateSmartEntityBody,
    useUpdateSmartEntityMutation,
} from "../../../Services/generated/smartEntitiesApi";
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
    const isCover = (item.entity_id ?? "").startsWith("cover.");
    const [position, setPosition] = useState(
        item.attributes?.current_position ?? 0
    );

    useEffect(() => {
        setPosition(item.attributes?.current_position ?? 0);
    }, [item.attributes?.current_position]);

    const updateEntity =
        (updateSmartEntityBody: UpdateSmartEntityBody) => async () => {
            try {
                if (item.entity_id) {
                    await updateSwitch({
                        entityId: item.entity_id,
                        updateSmartEntityBody,
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

    const setState = (state: "on" | "off") => updateEntity({ state });

    const commitPosition = (
        _event: Event | SyntheticEvent,
        value: number | number[]
    ) => updateEntity({ position: Array.isArray(value) ? value[0] : value })();

    // Bluetooth covers (e.g. Motionblind) report state 0 until woken up. Home
    // Assistant exposes a "connect" button entity per cover to work around
    // this, e.g. cover.motionblind_1caf -> button.motionblind_1caf_connect.
    const connectEntityId = item.entity_id?.startsWith("cover.")
        ? `button.${item.entity_id.slice("cover.".length)}_connect`
        : undefined;

    const connect = async () => {
        if (connectEntityId) {
            try {
                await updateSwitch({
                    entityId: connectEntityId,
                    updateSmartEntityBody: {},
                }).unwrap();
            } catch (error) {
                dispatch(
                    logError(
                        `SwitchesListItem connect failed: ${getErrorMessage(
                            error as SerializedError
                        )}`
                    )
                );
            }
        }
    };

    const label =
        (item.attributes?.friendly_name ?? "").length > 0
            ? item.attributes?.friendly_name
            : item.entity_id;

    if (isCover) {
        return (
            <ListItem disableGutters disablePadding sx={{ paddingX: 2 }}>
                <ListItemText
                    sx={{ flex: "0 0 auto", minWidth: 120, cursor: "pointer" }}
                    primary={label}
                    onClick={connect}
                />
                <Slider
                    sx={{ flex: 1, marginX: 2 }}
                    value={position}
                    onChange={(_event, value) =>
                        setPosition(Array.isArray(value) ? value[0] : value)
                    }
                    onChangeCommitted={commitPosition}
                    min={0}
                    max={100}
                    disabled={isLoading}
                    valueLabelDisplay="auto"
                />
            </ListItem>
        );
    }

    return (
        <ListItem disableGutters disablePadding>
            <SwitchesListItemButton
                onClick={setState("on")}
                selected={item.state === "on"}
                disabled={isLoading}
            >
                <RadioButtonCheckedIcon />
            </SwitchesListItemButton>
            <ListItemText sx={{ flex: 1, paddingX: 1 }} primary={label} />
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
