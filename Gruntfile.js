/* globals module, require */
module.exports = function(grunt) {
    'use strict';

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        less: {
            dev: {
                files: {
                    'public/css/homeRemote.css': 'public/_less/homeRemote.less'
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

        jscs: {
            options: {
                config: '.jscs',
                //force: true
                esnext: true
            },
            dev: {
                files: {
                    src: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js', 'server/**/*.js']
                }
            }
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
                    'public/_babel/classes/RadioToggleButton.js': 'public/_js/classes/RadioToggleButton.js',
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
                    'public/js/homeRemote.js': ['public/_babel/classes/RadioToggleButton.js', 'public/_babel/core.js']
                }
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
            express: {
                files: ['app.js'],
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

    grunt.registerTask('default', ['jscs', 'jshint', 'babel:dev', 'uglify:dev', 'less:dev', 'express', 'watch']);
};