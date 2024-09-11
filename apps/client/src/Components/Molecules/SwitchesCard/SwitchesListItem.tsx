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

interface SwitchesListItemProps {
    item: any;
}

export const SwitchesListItem: FC<SwitchesListItemProps> = () => {
    const setSelectedItem = () => {
        /* do nothing */
    };
    const Name = "a";

    return (
        <ListItem disableGutters disablePadding>
            <ListItemButton sx={{ flex: 1 }} onClick={() => setSelectedItem()}>
                <ListItemIcon sx={{ justifyContent: "center" }}>
                    <RadioButtonCheckedIcon />
                </ListItemIcon>
            </ListItemButton>
            <ListItemText
                sx={{ flex: 5 }}
                primary={"a"}
                secondary={
                    <>
                        b
                        {/* {ParentIndexNumber}x{IndexNumber}{" "}
                            <strong>{SeriesName} </strong>
                            {ProductionYear && ` (${ProductionYear}) `} */}
                    </>
                }
            />
            <ListItemButton sx={{ flex: 1 }} onClick={() => setSelectedItem()}>
                <ListItemIcon sx={{ justifyContent: "center" }}>
                    <RadioButtonUncheckedIcon />
                </ListItemIcon>
            </ListItemButton>
        </ListItem>
    );
};
