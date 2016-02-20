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
                <div className="hidden-xs col-md-12">
                    <div class="page-header">
                        <h1>HomeRemote</h1>
                    </div>
                </div>
                <div className="col-xs-12 col-md-3">
                    <ButtonGroup label=" 1" icon="lamp" id="switch1"/>
                    <ButtonGroup label=" 2" icon="lamp" id="switch2"/>
                    <ButtonGroup label=" 3" icon="lamp" id="switch3"/>
                    <ButtonGroup label=" 4" icon="lamp" id="clickstub"/>
                </div>
                <div className="col-xs-6 col-md-2 margin-top">
                    {/*<Toggle label="" id="togglestub" icon="volume-up"/>*/}{/* Broadcast */}
                    <Toggle label="" id="radio" icon="music"/>{/* Music on server */}
                </div>
                <div className="col-xs-12 col-md-7 margin-top">
                    <Log infoUrl="/radio/info"/>
                </div>
            </div>
        </div>, shell);
}

renderShell();