#!/usr/bin/env node
'use strict';

var exec = require('child_process').exec,
    fs = require('fs'),
    settings = require('../settings.json');

var bind = function(app, log) {

    app.get('/radio/start', function (req, res) {
        console.log('call to http://%s:%s/radio/start');

        exec('sudo service playradio start', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio start/') > -1) {
                res.send({status: 'started'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/stop', function (req, res) {
        console.log('call to http://%s:%s/radio/stop');
        exec('sudo service playradio stop', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/status', function (req, res) {
        console.log('call to http://%s:%s/radio/status');
        exec('sudo service playradio status', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio start/') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('playradio stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stdout + '|' + stderr);
                res.send('error');
            }
        });
    });

    // Get "now playing" information
    app.get('/radio/info', function(req, res) {
        // TODO path from settings.json
        var mplayerStatus = fs.readFileSync(settings.radiologpath, 'utf8');
        var regex = /ICY Info: StreamTitle='(.*)'/g;
        var m;
        var result = '';
        while ((m = regex.exec(mplayerStatus)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            // Only keep the last match as the result
            result = m[1];
        }
        res.send({status: result});
    });
};

module.exports = {
    bind: bind
};