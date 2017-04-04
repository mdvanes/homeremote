#!/usr/bin/env node
/* eslint-env node */

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
        try {
            const mplayerStatus = fs.readFileSync(settings.radiologpath, 'utf8');
            const regex = /ICY Info: StreamTitle='(.*)'/g;
            let m;
            let result = '';
            while ((m = regex.exec(mplayerStatus)) !== null) {
                if (m.index === regex.lastIndex) {
                    regex.lastIndex++;
                }
                // Only keep the last match as the result
                result = m[1];
            }
            res.send({status: result});
        } catch(ex) {
            res.send({status: 'error: radio log not found'});
        }
    });
};

module.exports = {
    bind: bind
};