import {
    Box,
    CssBaseline,
    Drawer,
    PaletteMode,
    StyledEngineProvider,
    ThemeProvider,
    useMediaQuery,
} from "@mui/material";
import { FC, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppBar from "./Components/Molecules/AppBar/AppBar";
import DownloadList from "./Components/Molecules/DownloadList/DownloadList";
import DrawerMenu from "./Components/Molecules/DrawerMenu/DrawerMenu";
import GlobalSnackbar from "./Components/Molecules/GlobalSnackbar/GlobalSnackbar";
import Jukebox from "./Components/Molecules/Jukebox/Jukebox";
import { logUrgentInfo } from "./Components/Molecules/LogCard/logSlice";
import UrlToMusic from "./Components/Molecules/UrlToMusic/UrlToMusic";
import { CarTwinPage } from "./Components/Pages/CarTwin/CarTwinPage";
import Dashboard from "./Components/Pages/Dashboard/Dashboard";
import DataLora from "./Components/Pages/DataLora/DataLora";
import Docker from "./Components/Pages/Docker/Docker";
import HomeAutomation from "./Components/Pages/HomeAutomation/HomeAutomation";
import Log from "./Components/Pages/Log/Log";
import Streams from "./Components/Pages/Streams/Streams";
import AuthenticationProvider from "./Components/Providers/Authentication/AuthenticationProvider";
import HotKeyProvider from "./Components/Providers/HotKey/HotKeyProvider";
import createThemeWithMode from "./theme";
import Energy from "./Components/Pages/Energy/Energy";

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
            <HotKeyProvider>
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
                                <Routes>
                                    <Route
                                        path="/"
                                        element={<HomeAutomation />}
                                    />
                                    <Route
                                        path="/music"
                                        element={<UrlToMusic />}
                                    />
                                    <Route
                                        path="/gears"
                                        element={<DownloadList />}
                                    />
                                    <Route
                                        path="/dashboard"
                                        element={<Dashboard />}
                                    />
                                    <Route
                                        path="/streams"
                                        element={<Streams />}
                                    />
                                    <Route
                                        path="/jukebox"
                                        element={<Jukebox />}
                                    />
                                    <Route
                                        path="/docker"
                                        element={<Docker />}
                                    />
                                    <Route
                                        path="/datalora"
                                        element={<DataLora />}
                                    />
                                    <Route
                                        path="/cartwin"
                                        element={<CarTwinPage />}
                                    />
                                    <Route
                                        path="/energy"
                                        element={<Energy />}
                                    />
                                    <Route path="/about" element={<Log />} />
                                </Routes>
                            </Box>
                        </BrowserRouter>
                        <GlobalSnackbar />
                    </ThemeProvider>
                </StyledEngineProvider>
            </HotKeyProvider>
        </AuthenticationProvider>
    );
};

export default App;
