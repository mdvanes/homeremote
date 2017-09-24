#!/usr/bin/env node
/* eslint-env node */

const exec = require('child_process').exec;
const settings = require('../settings.json');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, endpointName, serviceName, log) {

    app.get(`/${endpointName}/start`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/start`);

        exec(`VBoxManage startvm "${settings.vm.vmName}" --type headless`, function(error, stdout, stderr){
            log.info('['+stdout+']');
            // TODO Upstart gave more information when starting/stopping, do a better check for systemd
            if(stdout.indexOf('has been successfully started') > -1) {
                //if(stdout.length === 0) {
                res.send({status: 'started'});
            } else {
                log.error(error + ' ' + stderr);
                res.send('error');
            }
        });
    });

    app.get(`/${endpointName}/stop`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/stop`);
        exec(`VBoxManage controlvm "${settings.vm.vmName}" poweroff`, function(error, stdout, stderr){
            log.info('['+stdout+']');
            // TODO Upstart gave more information when starting/stopping, do a better check for systemd
            if(stdout.indexOf('100%') > -1) {
                //if(stdout.length === 0) {
                res.send({status: 'stopped'});
            } else {
                log.error(error + ' ' + stderr);
                res.send('error');
            }
        });
    });

    app.get(`/${endpointName}/status`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/status`);
        exec(`VBoxManage showvminfo "${settings.vm.vmName}" | grep State`, function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('running (') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('powered off (') > -1) {
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