import React from 'react';
import ButtonGroup from '../containers/button-group';
//import MacroButtonGroup from './components/macro-button-group';
import ToggleContainer from '../containers/ToggleContainer';
import {Card, CardText} from 'material-ui/Card';

export default class LightView extends React.Component {
    render() {
        return (
            <div className="col-xs-12 col-md-2" style={{backgroundColor: '#e0e0e0', paddingBottom: '1em', paddingTop: '1em', height: '100vh'}}>
                <ButtonGroup label=" l" icon="lightbulb_outline" type="switchscene" id="1"/>
                <ButtonGroup label=" k" icon="lightbulb_outline" type="switchlight" id="5"/>
                <ButtonGroup label=" n" icon="lightbulb_outline" type="switchlight" id="6"/>
                <ButtonGroup label=" s" icon="lightbulb_outline" type="switchlight" id="7"/>
                <Card style={{marginTop: '0.5em'}}>
                    <CardText className="row">
                        <div className="col-xs-4">
                            <ToggleContainer confirm={false} label="" id="radio" icon="music_note"/>{/* Music on server */}
                        </div>
                        <div className="col-xs-4">
                            <ToggleContainer confirm={false} label="" id="motion" icon="videocam"/>{/* Webcam/motion on server */}
                        </div>
                        <div className="col-xs-4">
                            <ToggleContainer confirm={true} label="" id="vm" icon="computer"/>{/* VM on server */}
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}