// from https://github.com/code0wl/react-example-es2015/blob/master/app/main.jsx#L5
//import './stylesheets/main.css';
import React from 'react';
import {render} from 'react-dom';
////import FilterableProductTable from './src/filterable-product-table';
import MyCheckbox from './my-checkbox';
import MyLog from './my-log';

// init shell
renderShell();

function renderShell() {
    var shell = document.createElement('div');
    shell.className = 'app-shell';
    document.body.appendChild(shell);
    render(
        <div>
            <MyCheckbox label="Switch 1" labelOn="lorem"/>
            <MyCheckbox label="Switch 2" labelOff="ipsum"/>
            <MyCheckbox label="Switch 3"/>
            <MyCheckbox label="Switch 4"/>
            <MyCheckbox label="Broadcast"/>
            <MyCheckbox label="3FM on Server"/>
            <MyLog/>
        </div>, shell);
}

