import React, { FC } from "react";
import {
    AppBar as MuiAppBar,
    Hidden,
    IconButton,
    Toolbar,
    Typography,
} from "@mui/material";
import MenuIcon from "@material-ui/icons/Menu";
import AppStatusButton from "../AppStatusButton/AppStatusButton";
import useStyles from "./AppBar.styles";
import { useSelector } from "react-redux";
import { RootState } from "../../../Reducers";
import { AuthenticationState } from "../../Providers/Authentication/authenticationSlice";

interface Props {
    toggleDrawer: () => void;
}

const AppBar: FC<Props> = ({ toggleDrawer }) => {
    const classes = useStyles();
    const greeting = useSelector<RootState, AuthenticationState["displayName"]>(
        (state: RootState) =>
            state.authentication.displayName
                ? `Hi, ${state.authentication.displayName}!`
                : ""
    );
    return (
        <div className={classes.root}>
            <MuiAppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        className={classes.menuButton}
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Hidden smUp>
                        <Typography variant="h6" className={classes.title}>
                            HR
                        </Typography>
                    </Hidden>
                    <Hidden xsDown>
                        <Typography variant="h6" className={classes.title}>
                            HomeRemote
                        </Typography>
                    </Hidden>
                    <Typography variant="body2" className={classes.currentUser}>
                        {greeting}
                    </Typography>
                    <AppStatusButton />
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

export default AppBar;
