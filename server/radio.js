#!/usr/bin/env node
/* eslint-env node */

const exec = require('child_process').exec;
const fs = require('fs');
const settings = require('../settings.json');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, log) {

    app.get('/radio/start', connectEnsureLogin(), function (req, res) {
        log.info('call to /radio/start');

        exec('sudo service playradio start', function(error, stdout, stderr){
            log.info('['+stdout+']');
            // TODO Upstart gave more information when starting/stopping, do a better check for systemd
            //if(stdout.indexOf('playradio start/') > -1) {
            if(stdout.length === 0) {
                res.send({status: 'started'});
            } else {
                log.error(error + ' ' + stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/stop', connectEnsureLogin(), function (req, res) {
        log.info('call to /radio/stop');
        exec('sudo service playradio stop', function(error, stdout, stderr){
            log.info('['+stdout+']');
            // TODO Upstart gave more information when starting/stopping, do a better check for systemd
            //if(stdout.indexOf('playradio stop/') > -1) {
            if(stdout.length === 0) {
                res.send({status: 'stopped'});
            } else {
                log.error(error + ' ' + stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/status', connectEnsureLogin(), function (req, res) {
        log.info('call to /radio/status');
        exec('sudo service playradio status', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('Active: active') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('Active: failed') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(error + ' ' + stdout + '|' + stderr);
                res.send('error');
            }
        });
    });

    // Get "now playing" information
    app.get('/radio/info', connectEnsureLogin(), function(req, res) {
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