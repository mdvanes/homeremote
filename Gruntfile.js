/* globals module, require */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //sass: {
        //    options: {
        //        sourceMap: true
        //    },
        //    dev: {
        //        files: {
        //            'public/css/homeRemote.css': 'public/_sass/homeRemote.scss'
        //        }
        //    }
        //},

        // There are no Windows binaries for Flow yet, but it works on Ubuntu
        // This configuration depends on the .flowconfig in the root
        flow: {
            options: {
                style: 'color'
            },
            files: {}
        },

        //webpack: {
        //    options: webpackConfig,
        //    build: {
        //        //stats: false, //stats: false disables the stats output
        //        //progress: false,
        //        plugins: [
        //            new webpack.DefinePlugin({
        //                'process.env': {
        //                    'NODE_ENV': JSON.stringify('production')
        //                }
        //            })
        //        ]
        //    }
        //    //nativeTest: {
        //    //    //stats: false, //stats: false disables the stats output
        //    //    progress: false,
        //    //    entry: './public/react/native',
        //    //    output: {
        //    //        path: './',
        //    //        filename: 'index.android.js'
        //    //    },
        //    //    plugins: [
        //    //        //new webpack.optimize.UglifyJsPlugin({
        //    //        //    compress: {
        //    //        //        warnings: false
        //    //        //    }
        //    //        //}),
        //    //        //new webpack.DefinePlugin({
        //    //        //    'process.env': {
        //    //        //        'NODE_ENV': JSON.stringify('production')
        //    //        //    }
        //    //        //})
        //    //    ]
        //    //}
        //},

        // See https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
        //'webpack-dev-server': {
        //    options: {
        //        webpack: webpackConfig,
        //        proxy: [
        //            {
        //                context: ['/radio', '/motion', '/fm'],
        //                target: 'http://localhost:3000',
        //                secure: false
        //            }
        //        ]
        //    },
        //    start: {
        //        contentBase: './public'
        //    }
        //},

        watch: {
            //sass: {
            //    files: ['public/_sass/**/*.scss'],
            //    tasks: ['sass:dev']
            //},
            // TODO  also reload server on changes in the npm devserver task
            express: {
                files: ['app.js', 'server/**/*.js'],
                tasks: ['express:dev'],
                options: {
                    spawn: false
                }
            }
        },

        express: {
            dev: {
                options: {
                    script: 'app.js',
                    // Note: bunyan logging doesn't work args: ['--debugremote | bunyan'],
                    args: ['--debugremote'],
                    background: true
                }
            }
        },

        // TODO Update cachebusting id in the HTML
        replace: {
            dist: {
                options: {
                    patterns: [
                        {
                            match: /\?v=[0-9]{12}/g,
                            replacement: '?v=' + grunt.template.today('yyyymmddHHMM')
                        }
                    ]
                },
                files: [
                    {
                        expand: true,
                        flatten: true,
                        src: [
                            'public/homeremote.mf',
                            'public/index.html'
                        ],
                        dest: 'public/'
                    }
                ]
            }
        }

    });

    // sass and watch are not reached because of webpack-dev-server
    //grunt.registerTask('default', ['express', 'sass:dev', 'watch', 'webpack-dev-server:start']);
    grunt.registerTask('build', ['replace:dist']);

};