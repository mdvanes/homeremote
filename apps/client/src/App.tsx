import React, { FC, useMemo, useState } from "react";
import {
    Drawer,
    ThemeProvider,
    StyledEngineProvider,
    Container,
    CssBaseline,
    Box,
    useMediaQuery,
    PaletteMode,
} from "@mui/material";
import HomeAutomation from "./Components/Pages/HomeAutomation/HomeAutomation";
import { BrowserRouter, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Log from "./Components/Pages/Log/Log";
import AuthenticationProvider from "./Components/Providers/Authentication/AuthenticationProvider";
import GlobalSnackbar from "./Components/Molecules/GlobalSnackbar/GlobalSnackbar";
import createThemeWithMode from "./theme";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import Streams from "./Components/Pages/Streams/Streams";
import AppBar from "./Components/Molecules/AppBar/AppBar";
import DrawerMenu from "./Components/Molecules/DrawerMenu/DrawerMenu";
import { logUrgentInfo } from "./Components/Molecules/LogCard/logSlice";
import UrlToMusic from "./Components/Molecules/UrlToMusic/UrlToMusic";
import DownloadList from "./Components/Molecules/DownloadList/DownloadList";
import Docker from "./Components/Pages/Docker/Docker";
import DataLora from "./Components/Pages/DataLora/DataLora";

export interface AppProps {
    swCallbacks: {
        logSuccess: null | ((m: string) => void);
        logUpdate: null | ((m: string) => void);
    };
}

const App: FC<AppProps> = ({ swCallbacks }) => {
    const [colorMode, setColorMode] = useState<PaletteMode>("dark");
    const dispatch = useDispatch();
    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
    const toggleDrawer = (): void => setIsDrawerOpen(!isDrawerOpen);
    const closeDrawer = (): void => setIsDrawerOpen(false);

    swCallbacks.logSuccess = (message: string) =>
        dispatch(logUrgentInfo(message));
    swCallbacks.logUpdate = (message: string) =>
        dispatch(logUrgentInfo(message));

    const isFullHd = useMediaQuery("(min-width:1920px)");

    const toggleColorMode = () => {
        setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
    };
    const theme = useMemo(() => createThemeWithMode(colorMode), [colorMode]);

    return (
        <AuthenticationProvider>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <AppBar toggleDrawer={toggleDrawer} />
                    <BrowserRouter>
                        <Drawer open={isDrawerOpen} onClose={closeDrawer}>
                            <DrawerMenu
                                closeDrawer={closeDrawer}
                                colorMode={colorMode}
                                toggleColorMode={toggleColorMode}
                            />
                        </Drawer>
                        {/* TODO this was for checking online/offline status for AppCache <StatusBar/>*/}
                        <Box
                            sx={
                                isFullHd
                                    ? {
                                          maxWidth: 1880,
                                          marginLeft: "auto",
                                          marginRight: "auto",
                                      }
                                    : {
                                          marginLeft: "16px",
                                          marginRight: "16px",
                                      }
                            }
                        >
                            <Route exact path="/" component={HomeAutomation} />
                            <Route exact path="/music" component={UrlToMusic} />
                            <Route
                                exact
                                path="/gears"
                                component={DownloadList}
                            />
                            <Route
                                exact
                                path="/dashboard"
                                component={Dashboard}
                            />
                            <Route exact path="/streams" component={Streams} />
                            <Route exact path="/docker" component={Docker} />
                            <Route
                                exact
                                path="/datalora"
                                component={DataLora}
                            />
                            <Route exact path="/about" component={Log} />
                        </Box>
                    </BrowserRouter>
                    <GlobalSnackbar />
                </ThemeProvider>
            </StyledEngineProvider>
        </AuthenticationProvider>
    );
};

export default App;
