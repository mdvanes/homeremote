// from https://github.com/code0wl/react-example-es2015/blob/master/app/main.jsx#L5
//import './stylesheets/main.css';
import React from 'react';
import {render} from 'react-dom';
////import FilterableProductTable from './src/filterable-product-table';
import ButtonGroup from './components/button-group';
import Toggle from './components/toggle';
import Log from './components/log';

// init shell
renderShell();

// TODO toggle as single button with icon (instead of 2 buttons)

function renderShell() {
    var shell = document.createElement('div');
    shell.className = 'app-shell container';
    document.body.appendChild(shell);
    render(
        <div>
            <div className="row">
                <div className="col-xs-12">
                    <ButtonGroup label=" 1" icon="lamp" id="clickstub"/>
                    <ButtonGroup label=" 2" icon="lamp" id="clickstub"/>
                    <ButtonGroup label=" 3" icon="lamp" id="clickstub"/>
                    <ButtonGroup label=" 4" icon="lamp" id="clickstub"/>
                </div>
            </div>
            <div className="row margin-top">
                {/*<Toggle label=" 2" id="togglestub" icon="lamp"/>
                <Toggle label=" 3" id="togglestub" icon="lamp"/>
                <Toggle label="Switch 4" id="togglestub"/>*/}
                <Toggle label="" id="togglestub" icon="volume-up"/>{/* Broadcast */}
                <Toggle label="" id="togglestub" icon="music"/>{/* Music on server */}
            </div>
            <div className="row margin-top">
                <div className="col-xs-12">
                    <Log/>
                </div>
            </div>
        </div>, shell);
}

