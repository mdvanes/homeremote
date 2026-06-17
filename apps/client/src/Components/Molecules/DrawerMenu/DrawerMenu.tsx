import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    PaletteMode,
} from "@mui/material";
import { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAppDispatch } from "../../../store";
import {
    FetchAuthType,
    fetchAuth,
} from "../../Providers/Authentication/authenticationSlice";

interface Props {
    closeDrawer: () => void;
    colorMode: PaletteMode;
    toggleColorMode: () => void;
}

// TODO indicate active route, see https://material-ui.com/guides/composition/#link

const DrawerMenu: FC<Props> = ({ closeDrawer, colorMode, toggleColorMode }) => {
    const dispatch = useAppDispatch();
    return (
        <div role="presentation" onClick={closeDrawer}>
            <List>
                <ListItemButton component={RouterLink} to="/">
                    <ListItemText primary="Home Automation" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/music">
                    <ListItemText primary="Music" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/gears">
                    <ListItemText primary="Gears" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/streams">
                    <ListItemText primary="Streams" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/jukebox">
                    <ListItemText primary="Jukebox" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/docker">
                    <ListItemText primary="Docker" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/datalora">
                    <ListItemText primary="Tracker" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/cartwin">
                    <ListItemText primary="CarTwin" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/energy">
                    <ListItemText primary="Energy" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to="/about">
                    <ListItemText primary="About" />
                </ListItemButton>
                <ListItemButton
                    onClick={(): void => {
                        dispatch(fetchAuth({ type: FetchAuthType.Logout }));
                    }}
                >
                    <ListItemText primary="Log out" />
                </ListItemButton>
                <ListItem>
                    <IconButton
                        aria-label="toggle-dark-mode"
                        onClick={toggleColorMode}
                    >
                        {colorMode === "light" ? (
                            <DarkModeIcon />
                        ) : (
                            <LightModeIcon />
                        )}
                    </IconButton>
                </ListItem>
            </List>
        </div>
    );
};

export default DrawerMenu;
