// @flow

import {render} from 'react-dom';
import React from 'react'; // eslint-disable-line no-unused-vars
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

//import '../library/bootstrap/css/bootstrap.min.css';
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
        return (<MuiThemeProvider muiTheme={muiTheme}>
            <div>
                <AppBar
                    title="HomeRemote"
                    iconClassNameRight="muidocs-icon-navigation-expand-more"
                    onLeftIconButtonTouchTap={this.toggleDrawer}
                />
                <Drawer open={this.state.open}>
                    <AppBar title="AppBar"
                        onLeftIconButtonTouchTap={this.toggleDrawer}
                    />
                    <MenuItem>Menu Item</MenuItem>
                    <MenuItem>Menu Item 2</MenuItem>
                </Drawer>
                <StatusBar/>
                <div className="row">
                    <div className="col-xs-12 col-md-3">
                        <ButtonGroup label=" l" icon="lightbulb_outline" type="switchscene" id="1"/>
                        <ButtonGroup label=" k" icon="lightbulb_outline" type="switchlight" id="5"/>
                        <ButtonGroup label=" n" icon="lightbulb_outline" type="switchlight" id="6"/>
                        <ButtonGroup label=" s" icon="lightbulb_outline" type="switchlight" id="7"/>
                        {/*<ButtonGroup label=" 4" icon="lamp" id="clickstub"/>*/}
                        {/*<MacroButtonGroup label=" All" icon="" id={['switch1', 'switch2', 'switch3', 'switch4']}/>*/}
                    </div>
                    <div className="col-xs-12 col-md-2">
                        {/*<Toggle label="" id="togglestub" icon="volume-up"/>*/}{/* Broadcast */}
                        <div className="row">
                            <div className="col-xs-6 col-md-12 margin-top">
                                <Toggle label="" id="radio" icon="music_note"/>{/* Music on server */}
                            </div>
                            <div className="col-xs-6 col-md-12 margin-top">
                                <Toggle label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
                            </div>
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-4">
                        <GetMusic/>
                    </div>
                    <div className="col-xs-12 col-md-3 margin-top">
                        <Log infoUrl="/radio/info"/>
                    </div>
                </div>
                <FileManager/>
                <Gears/>
            </div>
        </MuiThemeProvider>)
    };
}

render(<Main/>, document.getElementById('app'));