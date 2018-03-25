#!/usr/bin/env node
/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const common = {

    entry: {
        homeRemote: './src/js/main.jsx'
    },

    resolve: {
        extensions: ['.js', '.jsx']
    },

    output: {
        path: path.join(__dirname, 'public'),
        publicPath: '/', // For paths to the js from the /r/ views
        filename: ('production' === process.env.NODE_ENV) ? 'js/[name]-[hash:6].js' : 'js/[name].js'
    },

    // source-map is much slower than eval-source-map
    devtool: ('production' === process.env.NODE_ENV) ? 'source-map' : 'eval-source-map',

    devServer: {
        proxy: [
            {
                context: ['/radio', '/motion', '/fm', '/switch', '/getMusic', '/gears', '/vm', '/shell', '/r', '/login', '/logout'],
                target: 'http://localhost:3000',
                secure: false
            }
        ]
    },

    // TODO use extract plugin for CSS https://github.com/webpack-contrib/extract-text-webpack-plugin

    plugins: [
        new StyleLintPlugin({
            configFile: '.stylelintrc',
            files: ['src/sass/**/*.scss']
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: ('production' === process.env.NODE_ENV) ? { warnings: false } : false,
            sourceMap: true
        }),
        // This will inject the bundle name incl. hash into the HTML
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'src/index.templates.ejs',
            inject: 'body'
        }),
        new CleanWebpackPlugin(['public']),
        new CopyWebpackPlugin([
            {
                from: 'src/favicon.ico',
                to: 'favicon.ico'
            },
            {
                from: 'src/launcher-icon-4x.png',
                to: 'launcher-icon-4x.png'
            },
            {
                from: 'src/manifest.json',
                to: 'manifest.json'
            }
        ])
    ],

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loaders: ['babel-loader?presets[]=react,presets[]=env', 'eslint-loader']
            },
            {
                test: /\.js?$/,
                loaders: ['eslint-loader']
            },
            {
                test: /\.css$/,
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[hash].[ext]'
            }
        ]
    }
};

module.exports = common;