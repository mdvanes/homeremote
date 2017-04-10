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
import logApp from './reducers/reducers.js'; // TODO remove .js ?
import AddLogLine from './containers/AddLogLine';
import VisibleLogLines from './containers/VisibleLogLines';

import StatusBar from './components/status-bar';
import ButtonGroup from './components/button-group';
//import MacroButtonGroup from './components/macro-button-group';
import Toggle from './components/toggle';
import Log from './components/log';
import FileManager from './components/fm';
import GetMusic from './components/GetMusic';
import Gears from './components/Gears';

import injectTapEventPlugin from 'react-tap-event-plugin';
import {deepPurple900} from 'material-ui/styles/colors';
//import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

//import '../library/bootstrap/css/bootstrap.min.css';
import 'flexboxgrid/dist/flexboxgrid.min.css';
import '../sass/homeRemote.scss';

// testcase for Flow
// var str: number = 'hello world!';

injectTapEventPlugin();

// TODO extract these views to separate files and use ES6 syntax
const DashboardView = () => (
    <div className="container-fluid">
        <div className="row margin-top">
            <AddLogLine/>
            <VisibleLogLines/>
            <div className="col-xs-12 col-md-2">
                <ButtonGroup label=" l" icon="lightbulb_outline" type="switchscene" id="1"/>
                <ButtonGroup label=" k" icon="lightbulb_outline" type="switchlight" id="5"/>
                <ButtonGroup label=" n" icon="lightbulb_outline" type="switchlight" id="6"/>
                <ButtonGroup label=" s" icon="lightbulb_outline" type="switchlight" id="7"/>
                {/*<ButtonGroup label=" 4" icon="lamp" id="clickstub"/>*/}
                {/*<MacroButtonGroup label=" All" icon="" id={['switch1', 'switch2', 'switch3', 'switch4']}/>*/}
            </div>
            <div className="col-xs-12 col-md-1">
                {/*<Toggle label="" id="togglestub" icon="volume-up"/>*/}{/* Broadcast */}
                <div className="row">
                    <div className="col-xs-6 col-md-12">
                        <Toggle label="" id="radio" icon="music_note"/>{/* Music on server */}
                    </div>
                    <div className="col-xs-6 col-md-12">
                        <Toggle label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
                    </div>
                </div>
            </div>
            <div className="col-xs-12 col-md-3">
                <GetMusic/>
            </div>
            <div className="col-xs-12 col-md-6">
                <Log infoUrl="/radio/info"/>
            </div>
        </div>
        <FileManager/>
        <Gears/>
    </div>
)

const LightView = () => (
    <div className="col-xs-12 col-md-2 margin-top">
        <ButtonGroup label=" l" icon="lightbulb_outline" type="switchscene" id="1"/>
        <ButtonGroup label=" k" icon="lightbulb_outline" type="switchlight" id="5"/>
        <ButtonGroup label=" n" icon="lightbulb_outline" type="switchlight" id="6"/>
        <ButtonGroup label=" s" icon="lightbulb_outline" type="switchlight" id="7"/>
        <div className="row margin-top">
            <div className="col-xs-6">
                <Toggle label="" id="radio" icon="music_note"/>{/* Music on server */}
            </div>
            <div className="col-xs-6">
                <Toggle label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
            </div>
        </div>
    </div>
)

const MusicView = () => (
    <div className="col-xs-12 col-md-3 margin-top">
        <GetMusic/>
        <Log infoUrl="/radio/info"/>
    </div>
)

const FilesView = () => (
    <div>
        <FileManager/>
        <Log infoUrl="/radio/info"/>
    </div>
)

const GearsView = () => (
    <div>
        <Gears/>
        <Log infoUrl="/radio/info"/>
    </div>
)

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
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={this.toggleDrawer}
                    />
                    <Router>
                        <div>
                            <Drawer open={this.state.open}>
                                <AppBar
                                    onLeftIconButtonTouchTap={this.toggleDrawer}
                                    iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                                />
                                <MenuItem><Link onTouchTap={this.toggleDrawer} to="/">Dashboard</Link></MenuItem>
                                <MenuItem><Link onTouchTap={this.toggleDrawer} to="/r/light">Light</Link></MenuItem>
                                <MenuItem><Link onTouchTap={this.toggleDrawer} to="/r/music">Music</Link></MenuItem>
                                <MenuItem><Link onTouchTap={this.toggleDrawer} to="/r/files">Files</Link></MenuItem>
                                <MenuItem><Link onTouchTap={this.toggleDrawer} to="/r/gears">Gears</Link></MenuItem>
                            </Drawer>
                            <StatusBar/>
                            <Route exact path="/" component={DashboardView}/>
                            <Route path="/r/light" component={LightView}/>
                            <Route path="/r/music" component={MusicView}/>
                            <Route path="/r/files" component={FilesView}/>
                            <Route path="/r/gears" component={GearsView}/>
                        </div>
                    </Router>
                </div>
            </MuiThemeProvider>
        )
    };
}

//console.log('test1', logApp);
let store = createStore(logApp);

render(<Provider store={store}><Main/></Provider>, document.getElementById('app'));