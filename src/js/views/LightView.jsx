import React from 'react';
import ButtonGroup from '../components/button-group';
//import MacroButtonGroup from './components/macro-button-group';
import Toggle from '../components/toggle';

export default class LightView extends React.Component {
    render() {
        return (
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
        );
    }
}