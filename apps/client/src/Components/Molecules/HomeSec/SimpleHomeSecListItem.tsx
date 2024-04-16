import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import { FC } from "react";

const SimpleHomeSecListItem: FC<{ title: string; onClick: () => void }> = ({
    title,
    onClick,
}) => {
    return (
        <ListItem disableGutters disablePadding>
            <ListItemButton>
                <ListItemAvatar></ListItemAvatar>
                <ListItemText
                    primary={
                        <>
                            {title}
                            <IconButton
                                sx={{
                                    ".MuiSvgIcon-root": {
                                        marginTop: "-0.2rem",
                                    },
                                }}
                                onClick={onClick}
                            >
                                <RestartAltIcon />
                            </IconButton>
                        </>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
};

export default SimpleHomeSecListItem;
