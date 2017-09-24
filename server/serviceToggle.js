#!/usr/bin/env node
/* eslint-env node */

const exec = require('child_process').exec;
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, endpointName, serviceName, log) {

    app.get(`/${endpointName}/start`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/start`);

        exec(`sudo service ${serviceName} start`, function(error, stdout, stderr){
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

    app.get(`/${endpointName}/stop`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/stop`);
        exec(`sudo service ${serviceName} stop`, function(error, stdout, stderr){
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

    app.get(`/${endpointName}/status`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/status`);
        exec(`sudo service ${serviceName} status`, function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('Active: active') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('Active: failed') > -1 || stdout.indexOf('Active: inactive') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(error + ' ' + stdout + '|' + stderr);
                res.send('error');
            }
        });
    });

};

module.exports = {
    bind: bind
};