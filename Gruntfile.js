/* globals module, require */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            dev: {
                files: {
                    'public/css/homeRemote.css': 'public/_less/homeRemote.less',
                    'public/css/react.css': 'public/_less/react.less'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
                //force: true
            },
            all: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js', 'server/**/*.js']
        },

        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            dev: [
                'public/react/**/*.jsx'
            ]
        },

        jscs: {
            options: {
                config: '.jscsrc',
                //force: true
                esnext: true
            },
            dev: {
                files: {
                    src: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js', 'server/**/*.js', 'public/react/**/*.jsx'] // TODO react/request.js and exclude react/build/bundle.js
                }
            }
        },

        // TODO gives a fatal error, probably because there are no Windows binaries for Flow yet.
        flow: {
            options: {
                style: 'color'
            },
            files: {}
        },

        babel: {
            dev: {
                options: {
                    //compact: true,
                    //comments: false,
                    modules: 'ignore', // babel doesn't concatenate converted module files
                    //sourceMap: true
                },
                files: {
                    'public/_babel/classes/BroadcastButton.js': 'public/_js/classes/BroadcastButton.js',
                    'public/_babel/classes/RadioToggleButton.js': 'public/_js/classes/RadioToggleButton.js',
                    'public/_babel/classes/RadioInfoButton.js': 'public/_js/classes/RadioInfoButton.js',
                    'public/_babel/classes/RekelboxButtonGroup.js': 'public/_js/classes/RekelboxButtonGroup.js',
                    'public/_babel/core.js': 'public/_js/core.js'
                }
            }
        },

        uglify: {
            dev: {
                options: {
                    beautify: true, // for debugging
                    banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM") %> */',
                    mangle: false, // for debugging
                    sourceMap: true,
                    sourceMapIncludeSources: true
                },
                files: {
                    'public/js/homeRemote.js': [
                        'public/_babel/classes/BroadcastButton.js',
                        'public/_babel/classes/RadioToggleButton.js',
                        'public/_babel/classes/RadioInfoButton.js',
                        'public/_babel/classes/RekelboxButtonGroup.js',
                        'public/_babel/core.js'
                    ]
                }
            }
        },

        webpack: {
            // TODO this can be improved by using http://webpack.github.io/docs/webpack-dev-server.html#api
            options: webpackConfig,
            build: {
                //stats: false, //stats: false disables the stats output
                progress: false,
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({
                        compress: {
                            warnings: false
                        }
                    }),
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify('production')
                        }
                    })
                ]
            },
            nativeTest: {
                //stats: false, //stats: false disables the stats output
                progress: false,
                entry: './public/react/native',
                output: {
                    path: './',
                    filename: 'index.android.js'
                },
                plugins: [
                    //new webpack.optimize.UglifyJsPlugin({
                    //    compress: {
                    //        warnings: false
                    //    }
                    //}),
                    //new webpack.DefinePlugin({
                    //    'process.env': {
                    //        'NODE_ENV': JSON.stringify('production')
                    //    }
                    //})
                ]
            }
        },

        watch: {
            less: {
                files: ['public/_less/**/*.less'],
                tasks: ['less:dev']
            },
            script: {
                files: ['public/_js/**/*.js', 'server/**/*.js'],
                tasks: ['jscs', 'jshint', 'babel:dev', 'uglify:dev']
            },
            react: {
                files: ['public/react/**/*.jsx'],
                tasks: ['jscs', 'eslint', 'webpack:build']
            },
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
                    // TODO bunyan logging doesn't work args: ['--debugremote | bunyan'],
                    args: ['--debugremote'],
                    background: true
                }
            }
        }
    });

    grunt.registerTask('default', ['jscs', 'jshint', 'eslint', 'babel:dev', 'uglify:dev', 'less:dev', 'express', 'watch']);
};