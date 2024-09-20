import {
    ListItemButton,
    ListItemButtonProps,
    ListItemIcon,
} from "@mui/material";
import { FC } from "react";

export const SwitchesListItemButton: FC<ListItemButtonProps> = ({
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
