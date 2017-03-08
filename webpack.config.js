#!/usr/bin/env node
/* eslint-env node */
//var merge = require('webpack-merge');
//var TARGET = 'build';//process.env.TARGET;
const path = require('path');
const webpack = require('webpack');
const ROOT_PATH = path.resolve(__dirname);

const common = {

    // TODO fix webpack-dev-server with proxies https://webpack.github.io/docs/webpack-dev-server.html

    entry: {
        homeRemote: [path.resolve(ROOT_PATH, 'public/_js/main')]
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    output: {
        path: path.resolve(ROOT_PATH, 'public/js'),
        filename: '[name].js'
    },

    // Add source maps
    // TODO sourcemaps do not work now
    devtool: 'source-map', // TODO This is not what makes the build slow. It might be node-modules?

    plugins: [
        // TODO enable
        //new StyleLintPlugin({
        //    configFile: '.stylelintrc',
        //    files: ['src/**/*.scss']
        //}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader?presets[]=react,presets[]=es2015', 'eslint-loader']
            },
            {
                test: /\.js?$/,
                loaders: ['eslint-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            }
        ]
    }
};

module.exports = common;