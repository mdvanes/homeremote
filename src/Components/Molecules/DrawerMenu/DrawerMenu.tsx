import React, { FC } from "react";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import {
    fetchAuth,
    FetchAuthType,
} from "../../Providers/Authentication/authenticationSlice";
import { useDispatch } from "react-redux";

interface Props {
    closeDrawer: () => void;
}

// TODO indicate active route, see https://material-ui.com/guides/composition/#link

const DrawerMenu: FC<Props> = ({ closeDrawer }) => {
    const dispatch = useDispatch();
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
                <ListItem button component={RouterLink} to="/log">
                    <ListItemText primary="Logging" />
                </ListItem>
                <ListItem button component={RouterLink} to="/streams">
                    <ListItemText primary="Streams" />
                </ListItem>
                <ListItem
                    button
                    onClick={(): void => {
                        dispatch(fetchAuth({ type: FetchAuthType.Logout }));
                        // window.location.href = "/";
                    }}
                >
                    <ListItemText primary="Log out" />
                </ListItem>
            </List>
        </div>
    );
};

export default DrawerMenu;
