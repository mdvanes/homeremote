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
import { Link as RouterLink } from "react-router";
import { ROUTES } from "../../../routes";
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
                <ListItemButton component={RouterLink} to={ROUTES.home}>
                    <ListItemText primary="Home Automation" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.dashboard}>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.music}>
                    <ListItemText primary="Music" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.gears}>
                    <ListItemText primary="Gears" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.docker}>
                    <ListItemText primary="Docker" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.caddy}>
                    <ListItemText primary="Caddy" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.datalora}>
                    <ListItemText primary="Tracker" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.cartwin}>
                    <ListItemText primary="CarTwin" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.energy}>
                    <ListItemText primary="Energy" />
                </ListItemButton>
                <ListItemButton component={RouterLink} to={ROUTES.about}>
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
