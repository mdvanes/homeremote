import { Info as InfoIcon } from "@mui/icons-material";
import { ListItem, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { FC, ReactNode } from "react";

export const StatisticsListItem: FC<{
    primary: string;
    info?: string;
    icon: ReactNode;
}> = ({ icon, primary, info }) => {
    return (
        <ListItem
            secondaryAction={
                info && (
                    <Tooltip title={info}>
                        <InfoIcon />
                    </Tooltip>
                )
            }
        >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={primary} />
        </ListItem>
    );
};
