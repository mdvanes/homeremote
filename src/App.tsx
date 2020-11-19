import React, { FC, useState } from "react";
// Example of importing image
// import logo from './logo.svg';
// Example of importing CSS
// import './App.css';
import { Drawer, MuiThemeProvider, Container } from "@material-ui/core";
import HomeAutomation from "./Components/Pages/HomeAutomation/HomeAutomation";
import { BrowserRouter, Route } from "react-router-dom";
import Log from "./Components/Pages/Log/Log";
import AuthenticationProvider from "./Components/Providers/Authentication/AuthenticationProvider";
import GlobalSnackbar from "./Components/Molecules/GlobalSnackbar/GlobalSnackbar";
import theme from "./theme";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Streams from "./Components/Pages/Streams/Streams";
import AppBar from "./Components/Molecules/AppBar/AppBar";
import DrawerMenu from "./Components/Molecules/DrawerMenu/DrawerMenu";

const App: FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const toggleDrawer = (): void => setIsDrawerOpen(!isDrawerOpen);
    const closeDrawer = (): void => setIsDrawerOpen(false);
    return (
        <AuthenticationProvider>
            <MuiThemeProvider theme={theme}>
                <AppBar toggleDrawer={toggleDrawer} />
                <BrowserRouter>
                    <Drawer open={isDrawerOpen} onClose={closeDrawer}>
                        <DrawerMenu closeDrawer={closeDrawer} />
                    </Drawer>
                    {/* TODO what is this? <StatusBar/>*/}
                    <Container maxWidth="xl">
                        <Route exact path="/" component={HomeAutomation} />
                        <Route exact path="/music" component={HomeAutomation} />
                        <Route exact path="/files" component={HomeAutomation} />
                        <Route exact path="/gears" component={HomeAutomation} />
                        <Route exact path="/log" component={Log} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/streams" component={Streams} />
                    </Container>
                </BrowserRouter>
                <GlobalSnackbar />
            </MuiThemeProvider>
        </AuthenticationProvider>
    );
};

export default App;
