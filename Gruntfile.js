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
                    'public/css/homeRemote.css': 'public/_less/*.less'
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
                //force: true
            },
            all: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js']
        },

        jscs: {
            options: {
                config: '.jscs',
                //force: true
                esnext: true
            },
            dev: {
                files: {
                    src: ['Gruntfile.js', 'app.js', 'public/_js/**/*.js']
                }
            }
        },

        // TODO add babel?
        babel: {
            dev: {
                options: {
                    sourceMap: true
                },
                files: {
                    'public/js/homeRemote.js': 'public/_js/core.js'
                }
            }
        },

        watch: {
            less: {
                files: ['public/_less/**/*.less'],
                tasks: ['less:dev']
            },
            script: {
                files: ['public/_js/**/*.js'],
                tasks: ['jscs', 'jshint', 'babel:dev']
            }
        },

        express: {
            dev: {
                options: {
                    script: 'app.js',
                    background: true
                }
            }
        }
    });

    grunt.registerTask('default', ['jscs', 'jshint', 'babel:dev', 'less:dev', 'express', 'watch']);
};