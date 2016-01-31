import {render} from 'react-dom';
import React from 'react'; // eslint-disable-line no-unused-vars
import StatusBar from './components/status-bar';
import ButtonGroup from './components/button-group';
import Toggle from './components/toggle';
import Log from './components/log';

function renderShell() {
    var shell = document.createElement('div');
    shell.className = 'app-shell container';
    document.body.appendChild(shell);
    render(
        <div>
            <StatusBar/>
            <div className="row">
                <div className="col-xs-12">
                    <ButtonGroup label=" 1" icon="lamp" id="switch1"/>
                    <ButtonGroup label=" 2" icon="lamp" id="switch2"/>
                    <ButtonGroup label=" 3" icon="lamp" id="switch3"/>
                    <ButtonGroup label=" 4" icon="lamp" id="clickstub"/>
                </div>
            </div>
            <div className="row margin-top">
                <Toggle label="" id="togglestub" icon="volume-up"/>{/* Broadcast */}
                <Toggle label="" id="radio" icon="music"/>{/* Music on server */}
            </div>
            <div className="row margin-top">
                <div className="col-xs-12">
                    <Log/>
                </div>
            </div>
        </div>, shell);
}

renderShell();