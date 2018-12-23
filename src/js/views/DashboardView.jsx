// eslint-disable-next-line
import React from 'react';
import ToggleContainer from '../containers/ToggleContainer';
import {Card, CardText} from 'material-ui/Card';
import GetMusic from '../containers/GetMusicContainer';
import GearsContainer from '../containers/GearsContainer';

import LogContainer from '../containers/LogContainer';
//import AddLogLine from '../containers/AddLogLine';
import FileManagerContainer from '../containers/FileManagerContainer';
import SwitchesListContainer from '../containers/SwitchesListContainer';

const DashboardView = () => {
  return (
    <div className="container-fluid" style={{backgroundColor: '#e0e0e0', paddingBottom: '1em', paddingTop: '1em'}}>
      <div className="row">
        <div className="col-xs-12 col-md-2">
          <SwitchesListContainer/>
          {/*<ButtonGroup label=" 4" icon="lamp" id="clickstub"/>*/}
          {/*<MacroButtonGroup label=" All" icon="" id={['switch1', 'switch2', 'switch3', 'switch4']}/>*/}

          {/*/!*<Toggle label="" id="togglestub" icon="volume-up"/>*!//!* Broadcast *!/*/}
          <Card style={{marginTop: '0.5em'}}>
            <CardText className="row">
              <div className="col-xs-3 col-md-6">
                <ToggleContainer confirm={false} label="" id="playradio" icon="music_note"/>{/* Music on server */}
              </div>
              <div className="col-xs-3 col-md-6">
                <ToggleContainer confirm={false} label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
              </div>
              <div className="col-xs-3 col-md-6">
                <ToggleContainer confirm={true} label="" id="vm" icon="computer"/>{/* VM on server */}
              </div>
              <div className="col-xs-3 col-md-6">
                <ToggleContainer confirm={true} label="" id="vmservices" icon="settings"/>{/* services */}
              </div>
            </CardText>
          </Card>

        </div>
        <div className="col-xs-12 col-md-3">
          <GetMusic/>
        </div>
        <div className="col-xs-12 col-md-7">
          <LogContainer/>
        </div>
      </div>
      <FileManagerContainer/>
      <GearsContainer/>
    </div>
  );
};

export default DashboardView;
