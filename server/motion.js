#!/usr/bin/env node
'use strict';

var exec = require('child_process').exec,
    fs = require('fs');

var bind = function(app, log) {

    app.get('/motion/start', function (req, res) {
        console.log('call to http://%s:%s/motion/start');

        exec('sudo service motion start', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('motion start/') > -1) {
                res.send({status: 'started'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/motion/stop', function (req, res) {
        console.log('call to http://%s:%s/motion/stop');
        exec('sudo service motion stop', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('motion stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/motion/status', function (req, res) {
        console.log('call to http://%s:%s/motion/status');
        exec('sudo service motion status', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('motion start/') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('motion stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stdout + '|' + stderr);
                res.send('error');
            }
        });
    });

};

module.exports = {
    bind: bind
};