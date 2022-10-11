import React, { FC } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
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
                <ListItem button component={RouterLink} to="/streams">
                    <ListItemText primary="Streams" />
                </ListItem>
                <ListItem button component={RouterLink} to="/docker">
                    <ListItemText primary="Docker" />
                </ListItem>
                <ListItem button component={RouterLink} to="/datalora">
                    <ListItemText primary="Tracker" />
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
            </List>
        </div>
    );
};

export default DrawerMenu;
