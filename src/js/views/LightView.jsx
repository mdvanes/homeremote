// eslint-disable-next-line
import React from 'react';
import ToggleContainer from '../containers/ToggleContainer';
import {Card, CardText} from 'material-ui/Card';
import SwitchesListContainer from '../containers/SwitchesListContainer';

const LightView = () => {
  return (
    <div className="col-xs-12 col-md-2"
         style={{backgroundColor: '#e0e0e0', paddingBottom: '1em', paddingTop: '1em', height: '100vh'}}>
      <SwitchesListContainer/>
      <Card style={{marginTop: '0.5em'}}>
        <CardText className="row">
          <div className="col-xs-3 col-md-6">
            <ToggleContainer confirm={false} label="" id="radio" icon="music_note"/>{/* Music on server */}
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
  );
};

export default LightView;