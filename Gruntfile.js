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
                    'public/css/homeRemote.css': 'public/_less/homeRemote.less'
                }
            }
        },

        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            dev: [
                'public/_js/*.js',
                'public/_js/**/*.jsx'
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
                    src: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js', 'server/**/*.js', 'public/_js/**/*.jsx']
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
            //script: {
            //    files: ['public/_js/**/*.js', 'server/**/*.js'],
            //    tasks: ['jscs', 'jshint', 'babel:dev', 'uglify:dev']
            //},
            react: {
                files: ['public/react/**/*.jsx', 'public/react/*.js'],
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
        },

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
                            'public/react/homeremote.mf',
                            'public/react/index.html'
                        ],
                        dest: 'public/react/'
                    }
                ]
            }
        },

        'notify_hooks': {
            options: {
                enabled: true,
                'max_jshint_notifications': 5, // maximum number of notifications from jshint output
                title: '<%= pkg.name.toLowerCase() %>', // defaults to the name in package.json, or will use project directory's name
                success: false, // whether successful grunt executions should be notified automatically
                duration: 3 // the duration of notification in seconds, for `notify-send only
            }
        }
    });

    grunt.registerTask('default', ['jscs', 'eslint', 'less:dev', 'express', 'watch']);
    grunt.registerTask('build', ['jscs', 'eslint', 'less:dev', 'replace:dist']);

};