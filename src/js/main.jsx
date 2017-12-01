// @flow

import {render} from 'react-dom';
import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import homeRemoteReducers from './reducers';

import DashboardView from './views/DashboardView';
import LightView from './views/LightView';
import MusicView from './views/MusicView';
import FilesView from './views/FilesView';
import GearsView from './views/GearsView';
import MoveButtonSmallDir from './containers/MoveButtonSmallDir';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {deepPurple900} from 'material-ui/styles/colors';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import StatusBar from './components/status-bar';
import GlobalSnackBar from './containers/GlobalSnackBar';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ShellStatusButton from './containers/ShellStatusButton';

import 'flexboxgrid/dist/flexboxgrid.min.css';
import '../sass/homeRemote.scss';

// testcase for Flow
// var str: number = 'hello world!';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {
        primary1Color: deepPurple900,
    }
});
//darkBaseTheme.palette.primary1Color = deepPurple900;
//const muiTheme = getMuiTheme(darkBaseTheme);

class Main extends React.Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
        this.toggleDrawer = this.toggleDrawer.bind(this);
    }

    toggleDrawer() {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <AppBar
                        title="HomeRemote"
                        iconElementRight={<ShellStatusButton />}
                        onLeftIconButtonTouchTap={this.toggleDrawer}
                    />
                    <Router>
                        <div>
                            <Drawer open={this.state.open}>
                                <AppBar
                                    onLeftIconButtonTouchTap={this.toggleDrawer}
                                    iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                                />
                                <Link onTouchTap={this.toggleDrawer} to="/"><MenuItem>Dashboard</MenuItem></Link>
                                <Link onTouchTap={this.toggleDrawer} to="/r/light"><MenuItem>Light</MenuItem></Link>
                                <Link onTouchTap={this.toggleDrawer} to="/r/music"><MenuItem>Music</MenuItem></Link>
                                <Link onTouchTap={this.toggleDrawer} to="/r/files"><MenuItem>Files</MenuItem></Link>
                                <Link onTouchTap={this.toggleDrawer} to="/r/gears"><MenuItem>Gears</MenuItem></Link>
                                <a href="logout"><MenuItem>Log out</MenuItem></a>
                            </Drawer>
                            <StatusBar/>
                            <Route exact path="/" component={DashboardView}/>
                            <Route path="/r/light" component={LightView}/>
                            <Route path="/r/music" component={MusicView}/>
                            <Route path="/r/files" component={FilesView}/>
                            <Route path="/r/gears" component={GearsView}/>
                            <Route path="/r/movebuttondir" component={MoveButtonSmallDir}/>
                        </div>
                    </Router>
                    <GlobalSnackBar/>
                </div>
            </MuiThemeProvider>
        )
    };
}

const store = createStore(
    homeRemoteReducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

render(<Provider store={store}><Main/></Provider>, document.getElementById('app'));