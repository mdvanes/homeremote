import {
    IconButton,
    Popper,
    Box,
    Typography,
    ListItemText,
    ListItem,
    List,
    ListItemAvatar,
} from "@mui/material";
import { Help as HelpIcon } from "@mui/icons-material";
import { useState } from "react";

const HotKeyCoach = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    return (
        <>
            <IconButton onClick={handleClick}>
                <HelpIcon />
            </IconButton>
            <Popper id="simple-popper" open={open} anchorEl={anchorEl}>
                <Box sx={{ p: 1, bgcolor: "background.paper" }}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>p</ListItemAvatar>
                            <ListItemText>play/pause radio</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>j</ListItemAvatar>
                            <ListItemText>pause/play jukebox</ListItemText>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>t</ListItemAvatar>
                            <ListItemText>
                                toggle between radio and jukebox
                            </ListItemText>
                        </ListItem>
                    </List>
                </Box>
            </Popper>
        </>
    );
};
export default HotKeyCoach;
