import { Radio as RadioIcon } from "@mui/icons-material";
import {
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import { FC, useState } from "react";
import { useHotKeyContext } from "../../Providers/HotKey/HotKeyProvider";
import { CHANNELS } from "./channels";

/**
 * Radio station picker. Lives outside the inline player controls: it is a single
 * icon button that opens a menu of channels. Picking a channel switches to the
 * radio source and starts playing it.
 */
const RadioChannelMenu: FC = () => {
    const { radioChannelId, setRadioChannelId, playRadio } = useHotKeyContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const currentChannel = CHANNELS.find((c) => c.id === radioChannelId);

    const handleSelect = (id: typeof radioChannelId) => {
        setRadioChannelId(id);
        setAnchorEl(null);
        playRadio();
    };

    return (
        <>
            <Tooltip title={`Radio station: ${currentChannel?.name ?? ""}`}>
                <IconButton
                    aria-label="Choose radio station"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                >
                    <RadioIcon />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                {CHANNELS.map((c) => (
                    <MenuItem
                        key={c.id}
                        selected={c.id === radioChannelId}
                        onClick={() => handleSelect(c.id)}
                    >
                        <ListItemText>{c.name}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default RadioChannelMenu;
