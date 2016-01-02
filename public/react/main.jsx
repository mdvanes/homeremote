// from https://github.com/code0wl/react-example-es2015/blob/master/app/main.jsx#L5
//import './stylesheets/main.css';
import React from 'react';
import {render} from 'react-dom';
////import FilterableProductTable from './src/filterable-product-table';
import MyRadio from './my-radio';

// init shell
renderShell();

function renderShell() {
    console.log('foo');
    var shell = document.createElement('div');
    shell.className = 'app-shell';
    document.body.appendChild(shell);
    render(<MyRadio/>, shell);
}

