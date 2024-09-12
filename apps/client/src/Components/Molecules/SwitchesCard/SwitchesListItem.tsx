import {
    RadioButtonChecked as RadioButtonCheckedIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import {
    ListItem,
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
    ListItemText,
} from "@mui/material";
import { FC } from "react";
import { Switch } from "../../../Services/generated/switchesApi";

interface SwitchesListItemProps {
    item: Switch;
}

const SwitchesListItemButton: FC<ListItemButtonProps> = ({
    children,
    ...props
}) => {
    return (
        <ListItemButton sx={{ maxWidth: 65, flex: "0 0 auto" }} {...props}>
            <ListItemIcon sx={{ justifyContent: "center", minWidth: 24 }}>
                {children}
            </ListItemIcon>
        </ListItemButton>
    );
};

export const SwitchesListItem: FC<SwitchesListItemProps> = ({ item }) => {
    const setSelectedItem = () => {
        /* do nothing */
    };

    return (
        <ListItem disableGutters disablePadding>
            <SwitchesListItemButton
                onClick={() => setSelectedItem()}
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
                onClick={() => setSelectedItem()}
                selected={item.state === "off"}
            >
                <RadioButtonUncheckedIcon />
            </SwitchesListItemButton>
        </ListItem>
    );
};
