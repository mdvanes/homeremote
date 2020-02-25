import React, { FC } from 'react';
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
    Typography
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
    return (
        <MuiThemeProvider theme={theme}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">HomeRemote</Typography>
                </Toolbar>
            </AppBar>
            <Drawer>
                <AppBar></AppBar>
                test
            </Drawer>
            <HomeAutomation />
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
