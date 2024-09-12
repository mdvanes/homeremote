import {
    RadioButtonChecked as RadioButtonCheckedIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import {
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { FC } from "react";
import { Switch } from "../../../Services/generated/switchesApi";

interface SwitchesListItemProps {
    item: Switch;
}

export const SwitchesListItem: FC<SwitchesListItemProps> = ({ item }) => {
    const setSelectedItem = () => {
        /* do nothing */
    };
    const Name = "b";

    return (
        <ListItem disableGutters disablePadding>
            <ListItemButton
                sx={{ maxWidth: "100px" }}
                onClick={() => setSelectedItem()}
            >
                <ListItemIcon sx={{ justifyContent: "center" }}>
                    <RadioButtonCheckedIcon />
                </ListItemIcon>
            </ListItemButton>
            <ListItemText
                sx={{ flex: 5 }}
                primary={item.state}
                secondary={
                    <>
                        {item.state}
                        {/* {ParentIndexNumber}x{IndexNumber}{" "}
                            <strong>{SeriesName} </strong>
                            {ProductionYear && ` (${ProductionYear}) `} */}
                    </>
                }
            />
            <ListItemButton
                sx={{ maxWidth: "100px" }}
                onClick={() => setSelectedItem()}
            >
                <ListItemIcon sx={{ justifyContent: "center" }}>
                    <RadioButtonUncheckedIcon />
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
