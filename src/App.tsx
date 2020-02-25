import React, { FC, useState } from 'react';
// Example of importing image
// import logo from './logo.svg';
// Example of importing CSS
import './App.css';
import {
    AppBar,
    createMuiTheme,
    Drawer,
    IconButton,
    MuiThemeProvider,
    Toolbar,
    Typography,
    Link, MenuItem
} from '@material-ui/core';
import { deepPurple, orange } from '@material-ui/core/colors';
import MenuIcon from '@material-ui/icons/Menu';
import HomeAutomation from './Components/Pages/HomeAutomation/HomeAutomation';

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
    return (
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
            <Drawer
                open={isDrawerOpen}
                onClose={(): void => setIsDrawerOpen(false)}
            >
                <MenuItem>Home Automation</MenuItem>
                {/*<Link onClick={this.toggleDrawer} to="/"><MenuItem>Home Automation</MenuItem></Link>
                <Link to="/r/music"><MenuItem>Music</MenuItem></Link>
                <Link to="/r/files"><MenuItem>Files</MenuItem></Link>
                <Link to="/r/gears"><MenuItem>Gears</MenuItem></Link>
                <Link to="/r/log"><MenuItem>Log</MenuItem></Link>
                <Link to="/r/dashboard"><MenuItem>Dashboard</MenuItem></Link>
                <a onClick={() => { localStorage.removeItem('hr-remember-me') }} href="logout"><MenuItem>Log out</MenuItem></a>*/}
            </Drawer>
            {/* TODO what is this? <StatusBar/>*/}
            <HomeAutomation />
            test
            {/* TODO <GlobalSnackBar/>*/}
        </MuiThemeProvider>
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
