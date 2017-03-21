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

import styleBootstrap from '../library/bootstrap/css/bootstrap.min.css'; // eslint-disable-line no-unused-vars
import styleMain from '!style-loader!css-loader!sass-loader!../sass/homeRemote.scss'; // eslint-disable-line no-unused-vars

// testcase for Flow
// var str: number = 'hello world!';

function renderShell() {
    var shell = document.createElement('div');
    shell.className = 'app-shell container';
    document.body.appendChild(shell);
    render(
        <div>
            <StatusBar/>
            <div className="row">
                <div className="hidden-xs col-md-12">
                    <h1>HomeRemote</h1>
                </div>
                <div className="col-xs-12 col-md-3">
                    <ButtonGroup label=" l" icon="lamp" type="switchscene" id="1"/>
                    <ButtonGroup label=" k" icon="lamp" type="switchlight" id="5"/>
                    <ButtonGroup label=" n" icon="lamp" type="switchlight" id="6"/>
                    <ButtonGroup label=" s" icon="lamp" type="switchlight" id="7"/>
                    {/*<ButtonGroup label=" 4" icon="lamp" id="clickstub"/>*/}
                    {/*<MacroButtonGroup label=" All" icon="" id={['switch1', 'switch2', 'switch3', 'switch4']}/>*/}
                </div>
                <div className="col-xs-12 col-md-2">
                    {/*<Toggle label="" id="togglestub" icon="volume-up"/>*/}{/* Broadcast */}
                    <div className="row">
                        <div className="col-xs-6 col-md-12 margin-top">
                            <Toggle label="" id="radio" icon="music"/>{/* Music on server */}
                        </div>
                        <div className="col-xs-6 col-md-12 margin-top">
                            <Toggle label="" id="motion" icon="camera"/>{/* Webcam/motion on server */}
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-7 margin-top">
                    <Log infoUrl="/radio/info"/>
                </div>
                <FileManager/>
                <GetMusic/>
                <Gears/>
            </div>
        </div>, shell);
}

renderShell();