import React, { FC } from "react";
import {
    AppBar as MuiAppBar,
    IconButton,
    Toolbar,
    Typography,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import AppStatusButton from "../AppStatusButton/AppStatusButton";
import useStyles from "./AppBar.styles";

interface Props {
    toggleDrawer: () => void;
}


const AppBar: FC<Props> = ({ toggleDrawer }) => {
    const classes = useStyles();

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
                    <Typography variant="h6" className={classes.title}>HomeRemote</Typography>
                    <AppStatusButton />
                </Toolbar>
            </MuiAppBar>
        </div>
    );
};

export default AppBar;
