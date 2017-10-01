import React from 'react';
import ButtonGroup from '../components/button-group';
//import MacroButtonGroup from './components/macro-button-group';
import ToggleContainer from '../containers/ToggleContainer';
import {Card, CardText} from 'material-ui/Card';
import GetMusic from '../components/GetMusic';
import GearsContainer from '../containers/GearsContainer';

import LogContainer from '../containers/LogContainer';
//import AddLogLine from '../containers/AddLogLine';
import FileManagerContainer from '../containers/FileManagerContainer';

export default class DashboardView extends React.Component {
    render() {
        return (
            <div className="container-fluid" style={{backgroundColor: '#e0e0e0', paddingBottom: '1em', paddingTop: '1em'}}>
                <div className="row">
                    <div className="col-xs-12 col-md-2">
                        <ButtonGroup label=" l" icon="lightbulb_outline" type="switchscene" id="1"/>
                        <ButtonGroup label=" k" icon="lightbulb_outline" type="switchlight" id="5"/>
                        <ButtonGroup label=" n" icon="lightbulb_outline" type="switchlight" id="6"/>
                        <ButtonGroup label=" s" icon="lightbulb_outline" type="switchlight" id="7"/>
                        {/*<ButtonGroup label=" 4" icon="lamp" id="clickstub"/>*/}
                        {/*<MacroButtonGroup label=" All" icon="" id={['switch1', 'switch2', 'switch3', 'switch4']}/>*/}

                        {/*/!*<Toggle label="" id="togglestub" icon="volume-up"/>*!//!* Broadcast *!/*/}
                        <Card style={{marginTop: '0.5em'}}>
                            <CardText className="row">
                                <div className="col-xs-4">
                                    <ToggleContainer label="" id="radio" icon="music_note"/>{/* Music on server */}
                                </div>
                                <div className="col-xs-4">
                                    <ToggleContainer label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
                                </div>
                                <div className="col-xs-4">
                                    <ToggleContainer label="" id="vm" icon="computer"/>{/* VM on server */}
                                </div>
                            </CardText>
                        </Card>

                    </div>
                    <div className="col-xs-12 col-md-3">
                        <GetMusic/>
                    </div>
                    <div className="col-xs-12 col-md-7">
                        <LogContainer infoUrl="/nowplaying/info"/>
                    </div>
                </div>
                <FileManagerContainer/>
                <GearsContainer/>
            </div>
        );
    }
}
