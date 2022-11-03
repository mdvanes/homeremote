import {
    IconButton,
    Popper,
    Box,
    ListItemText,
    ListItem,
    List,
    ListItemAvatar,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import { useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";

const HotKeyCoach = () => {
    const { hotKeyMap } = useHotKeyContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const hotKeyMapEntries = Object.entries(hotKeyMap);

    return (
        <>
            <IconButton onClick={handleClick}>
                <HelpIcon />
            </IconButton>
            <Popper id="simple-popper" open={open} anchorEl={anchorEl}>
                <Box sx={{ p: 1, bgcolor: "background.paper" }}>
                    <List>
                        {hotKeyMapEntries.map(([k, v]) => {
                            return (
                                <ListItem key={k}>
                                    <ListItemAvatar>{k}</ListItemAvatar>
                                    <ListItemText>{v.description}</ListItemText>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Popper>
        </>
    );
};
export default HotKeyCoach;
