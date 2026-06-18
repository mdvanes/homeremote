import { Help as HelpIcon } from "@mui/icons-material";
import {
    Avatar,
    Box,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover,
    Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

const HotKeyCoach = () => {
    const { hotKeyMap } = useHotKeyContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const hotKeyMapEntries = Object.entries(hotKeyMap);

    return (
        <>
            <Tooltip title="Keyboard shortcuts">
                <IconButton
                    aria-label="Keyboard shortcuts"
                    onClick={handleClick}
                >
                    <HelpIcon />
                </IconButton>
            </Tooltip>
            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Box sx={{ width: 360, maxHeight: 440, overflowY: "auto" }}>
                    <List>
                        {hotKeyMapEntries.map(([k, v]) => {
                            return (
                                <ListItem key={k}>
                                    <ListItemAvatar>
                                        <Avatar
                                            variant="rounded"
                                            sx={{
                                                width: 32,
                                                height: 32,
                                                fontSize: "0.875rem",
                                                textTransform: "uppercase",
                                            }}
                                        >
                                            {k}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText>{v.description}</ListItemText>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Popover>
        </>
    );
};
export default HotKeyCoach;
