import React from 'react';
import ButtonGroup from '../components/button-group';
//import MacroButtonGroup from './components/macro-button-group';
import Toggle from '../components/toggle';
import GetMusic from '../components/GetMusic';
import Gears from '../components/Gears';

import LogContainer from '../containers/LogContainer';
//import AddLogLine from '../containers/AddLogLine';
import FileManagerContainer from '../containers/FileManagerContainer';

export default class DashboardView extends React.Component {
    render() {
        return (
            <div className="container-fluid" style={{backgroundColor: '#e0e0e0'}}>
                <div className="row margin-top">
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
                        {/*<AddLogLine/>*/}
                        <LogContainer infoUrl="/radio/info"/>
                    </div>
                </div>
                <FileManagerContainer/>
                <Gears/>
            </div>
        );
    }
}
