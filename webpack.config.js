#!/usr/bin/env node
/* eslint-env node */
//var merge = require('webpack-merge');
//var TARGET = 'build';//process.env.TARGET;
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
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
        filename: ('production' === process.env.NODE_ENV) ? '[name]-[hash:6].js' : '[name].js'
    },

    // TODO This is not what makes the build slow. It might be node-modules?
    devtool: ('production' === process.env.NODE_ENV) ? 'source-map' : 'eval-source-map',

    devServer: {
        publicPath: '/js/',
        proxy: [
            {
                context: ['/radio', '/motion', '/fm'],
                target: 'http://localhost:3000',
                secure: false
            }
        ]
    },

    plugins: [
        new StyleLintPlugin({
           configFile: '.stylelintrc',
           files: ['public/_sass/**/*.scss']
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true
        }),
        // This will inject the bundle name incl. hash into the HTML
        new HtmlWebpackPlugin({
            filename: 'public/index.html'
        })
    ],

    module: {
        rules: [
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
                loaders: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff2?|ttf|eot|svg)$/,
                //loader: 'url-loader?limit=10000&name=fonts/[path][name].[hash].[ext]'
                // TODO this is a hack, the generated font files are not used. This would not work if "/library" would be outside "/public"
                loader: 'url-loader?limit=10000&name=/library/bootstrap/fonts/[name].[ext]'
            }
        ]
    }
};

module.exports = common;