/* globals module, require */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    var webpack = require('webpack');
    var webpackConfig = require('./webpack.config.js');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            options: {
                sourceMap: true
            },
            dev: {
                files: {
                    'public/css/homeRemote.css': 'public/_sass/homeRemote.scss'
                }
            }
        },

        // There are no Windows binaries for Flow yet, but it works on Ubuntu
        // This configuration depends on the .flowconfig in the root
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
                //progress: false,
                plugins: [
                    new webpack.DefinePlugin({
                        'process.env': {
                            'NODE_ENV': JSON.stringify('production')
                        }
                    })
                ]
            }
            //nativeTest: {
            //    //stats: false, //stats: false disables the stats output
            //    progress: false,
            //    entry: './public/react/native',
            //    output: {
            //        path: './',
            //        filename: 'index.android.js'
            //    },
            //    plugins: [
            //        //new webpack.optimize.UglifyJsPlugin({
            //        //    compress: {
            //        //        warnings: false
            //        //    }
            //        //}),
            //        //new webpack.DefinePlugin({
            //        //    'process.env': {
            //        //        'NODE_ENV': JSON.stringify('production')
            //        //    }
            //        //})
            //    ]
            //}
        },

        // See https://github.com/webpack/webpack-with-common-libs/blob/master/Gruntfile.js
        'webpack-dev-server': {
            options: {
                webpack: webpackConfig,
                proxy: [
                    {
                        context: ['/radio', '/motion', '/fm'],
                        target: 'http://localhost:3000',
                        secure: false
                    }
                ]
            },
            start: {
                contentBase: './public'
            }
        },

        watch: {
            sass: {
                files: ['public/_sass/**/*.scss'],
                tasks: ['sass:dev']
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
                            'public/homeremote.mf',
                            'public/index.html'
                        ],
                        dest: 'public/'
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

    // TODO sass and watch are not reached now
    grunt.registerTask('default', ['express', 'sass:dev', 'watch', 'webpack-dev-server:start']);
    // TODO sass:dist
    grunt.registerTask('build', ['eslint', 'webpack:build', 'sass:dev', 'replace:dist']);

};