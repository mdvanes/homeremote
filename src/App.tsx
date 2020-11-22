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

// TODO typescript should be upgraded but causes problem: https://github.com/facebook/create-react-app/issues/10110#issuecomment-731109866

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
                    {/* TODO this was for checking online/offline status for AppCache <StatusBar/>*/}
                    <Container maxWidth="xl">
                        <Route exact path="/" component={HomeAutomation} />
                        <Route exact path="/music" component={HomeAutomation} />
                        <Route exact path="/files" component={HomeAutomation} />
                        <Route exact path="/gears" component={HomeAutomation} />
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/streams" component={Streams} />
                        <Route exact path="/about" component={Log} />
                    </Container>
                </BrowserRouter>
                <GlobalSnackbar />
            </MuiThemeProvider>
        </AuthenticationProvider>
    );
};

export default App;
