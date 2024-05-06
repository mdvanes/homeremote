import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import {
    IconButton,
    List,
    ListItem,
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
                <ListItem button component={RouterLink} to="/">
                    <ListItemText primary="Home Automation" />
                </ListItem>
                <ListItem button component={RouterLink} to="/dashboard">
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button component={RouterLink} to="/music">
                    <ListItemText primary="Music" />
                </ListItem>
                <ListItem button component={RouterLink} to="/gears">
                    <ListItemText primary="Gears" />
                </ListItem>
                <ListItem button component={RouterLink} to="/streams">
                    <ListItemText primary="Streams" />
                </ListItem>
                <ListItem button component={RouterLink} to="/jukebox">
                    <ListItemText primary="Jukebox" />
                </ListItem>
                <ListItem button component={RouterLink} to="/docker">
                    <ListItemText primary="Docker" />
                </ListItem>
                <ListItem button component={RouterLink} to="/datalora">
                    <ListItemText primary="Tracker" />
                </ListItem>
                <ListItem button component={RouterLink} to="/cartwin">
                    <ListItemText primary="CarTwin" />
                </ListItem>
                <ListItem button component={RouterLink} to="/energy">
                    <ListItemText primary="Energy" />
                </ListItem>
                <ListItem button component={RouterLink} to="/about">
                    <ListItemText primary="About" />
                </ListItem>
                <ListItem
                    button
                    onClick={(): void => {
                        dispatch(fetchAuth({ type: FetchAuthType.Logout }));
                    }}
                >
                    <ListItemText primary="Log out" />
                </ListItem>
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
