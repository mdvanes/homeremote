import React, { FC, useState } from 'react';
// Example of importing image
// import logo from './logo.svg';
// Example of importing CSS
// import './App.css';
import {
    AppBar,
    createMuiTheme,
    Drawer,
    IconButton,
    MuiThemeProvider,
    Toolbar,
    Typography,
    MenuItem
} from '@material-ui/core';
import { deepPurple, orange } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/Menu';
import HomeAutomation from './Components/Pages/HomeAutomation/HomeAutomation';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import Log from './Components/Pages/Log/Log';
import AuthenticationProvider from './AuthenticationProvider';

const theme = createMuiTheme({
    palette: {
        // Can't use deepPurple[900] directly, see https://material-ui.com/customization/color/#official-color-tool
        primary: deepPurple,
        secondary: orange
    }
});

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
                                localStorage.removeItem('hr-remember-me');
                            }}
                            href="/logout"
                        >
                            <MenuItem>Log out</MenuItem>
                        </a>
                    </Drawer>
                    {/* TODO what is this? <StatusBar/>*/}
                    <Route exact path="/" component={HomeAutomation} />
                    <Route exact path="/music" component={HomeAutomation} />
                    <Route exact path="/files" component={HomeAutomation} />
                    <Route exact path="/gears" component={HomeAutomation} />
                    <Route exact path="/log" component={Log} />
                    <Route exact path="/dashboard" component={HomeAutomation} />
                </BrowserRouter>
                {/* TODO <GlobalSnackBar/>*/}
            </MuiThemeProvider>
        </AuthenticationProvider>
        /*    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>*/
    );
};

export default App;
