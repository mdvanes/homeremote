import React, { FC, useState } from "react";
// Example of importing image
// import logo from './logo.svg';
// Example of importing CSS
// import './App.css';
import {
    AppBar,
    Drawer,
    IconButton,
    MuiThemeProvider,
    Toolbar,
    Typography,
    MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import HomeAutomation from "./Components/Pages/HomeAutomation/HomeAutomation";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Log from "./Components/Pages/Log/Log";
import AuthenticationProvider from "./AuthenticationProvider";
import GlobalSnackbar from "./Components/Molecules/GlobalSnackbar/GlobalSnackbar";
import theme from "./theme";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";

const App: FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const toggleDrawer = (): void => setIsDrawerOpen(!isDrawerOpen);
    const closeDrawer = (): void => setIsDrawerOpen(false);
    return (
        <AuthenticationProvider>
            <MuiThemeProvider theme={theme}>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6">HomeRemote</Typography>
                    </Toolbar>
                </AppBar>
                <BrowserRouter>
                    <Drawer open={isDrawerOpen} onClose={closeDrawer}>
                        <Link onClick={closeDrawer} to="/">
                            <MenuItem>Home Automation</MenuItem>
                        </Link>
                        <Link onClick={closeDrawer} to="/music">
                            <MenuItem>Music</MenuItem>
                        </Link>
                        <Link onClick={closeDrawer} to="/files">
                            <MenuItem>Files</MenuItem>
                        </Link>
                        <Link onClick={closeDrawer} to="/gears">
                            <MenuItem>Gears</MenuItem>
                        </Link>
                        <Link onClick={closeDrawer} to="/log">
                            <MenuItem>Log</MenuItem>
                        </Link>
                        <Link onClick={closeDrawer} to="/dashboard">
                            <MenuItem>Dashboard</MenuItem>
                        </Link>
                        <a
                            onClick={(): void => {
                                // localStorage.removeItem("hr-remember-me");
                                localStorage.removeItem("token");
                            }}
                            href="/logout"
                        >
                            <MenuItem>Log out</MenuItem>
                        </a>
                    </Drawer>
                    {/* TODO what is this? <StatusBar/>*/}
                    <Route exact path="/" component={Dashboard} />
                    <Route exact path="/music" component={HomeAutomation} />
                    <Route exact path="/files" component={HomeAutomation} />
                    <Route exact path="/gears" component={HomeAutomation} />
                    <Route exact path="/log" component={Log} />
                    <Route exact path="/dashboard" component={Dashboard} />
                </BrowserRouter>
                <GlobalSnackbar />
            </MuiThemeProvider>
        </AuthenticationProvider>
    );
};

export default App;
