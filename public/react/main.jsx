// from https://github.com/code0wl/react-example-es2015/blob/master/app/main.jsx#L5
//import './stylesheets/main.css';
import React from 'react';
import {render} from 'react-dom';
////import FilterableProductTable from './src/filterable-product-table';
import MyButtonSet from './my-button-set';
import MyToggle from './my-toggle';
import MyLog from './my-log';

// init shell
renderShell();

function renderShell() {
    var shell = document.createElement('div');
    shell.className = 'app-shell';
    document.body.appendChild(shell);
    render(
        <div>
            <MyButtonSet label="Switch 1"/>
            <MyToggle label="Switch 2"/>
            <MyToggle label="Switch 3"/>
            <MyToggle label="Switch 4"/>
            <MyToggle label="Broadcast" labelOn="lorem"/>
            <MyToggle label="3FM on Server" labelOff="ipsum"/>
            <MyLog/>
        </div>, shell);
}

