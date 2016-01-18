var path = require('path');
var merge = require('webpack-merge');
var webpack = require('webpack');
var TARGET = 'build';//process.env.TARGET;
var ROOT_PATH = path.resolve(__dirname);
//var HtmlWebpackPlugin = require('html-webpack-plugin');

var common = {

    entry: [path.resolve(ROOT_PATH, 'public/react/main')],

    resolve: {
        extensions: ['', '.js', '.jsx']
    },

    output: {
        path: path.resolve(ROOT_PATH, 'public/react/build'),
        filename: 'bundle.js'
    },

    //plugins: [
    //    new HtmlWebpackPlugin({
    //        title: 'React ES2015'
    //    })
    //],

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                //loaders: ['react-hot', 'babel?stage=1'],
                loader: 'babel?presets[]=react,presets[]=es2015'
                //include: path.resolve(ROOT_PATH, 'public/react')
            },

            {
                test: /\.css$/,
                loaders: ['style', 'css']
            }
        ]
    }
};

module.exports = common;
//switch (TARGET) {
//    case 'build':
//        module.exports = merge(common, {
//            plugins: [
//                new webpack.optimize.UglifyJsPlugin({
//                    compress: {
//                        warnings: false
//                    }
//                }),
//                new webpack.DefinePlugin({
//                    'process.env': {
//                        'NODE_ENV': JSON.stringify('production')
//                    }
//                })
//            ]
//        });
//
//        break;
//
//    case 'dev':
//        module.exports = merge(common, {
//            entry: [
//                'webpack-dev-server/client?http://localhost:8080',
//                'webpack/hot/dev-server'
//            ]
//        });
//        break;
//}