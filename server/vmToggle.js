#!/usr/bin/env node
/* eslint-env node */

const exec = require('../test/server/mockatoo').mock('child_process', 'vmToggle').exec;
const settings = require('../settings.json');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, endpointName, serviceName, log) {

    app.get(`/${endpointName}/start`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/start`);

        // Starting the the virtual machine with VBoxManage instead of VBoxHeadless solves my problem: VBoxManage startvm <uuid|vmname> --type headless
        exec(`sudo -u ${settings.vm.userName} VBoxManage startvm "${settings.vm.vmName}" --type headless`, function(error, stdout, stderr){
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
        exec(`sudo -u ${settings.vm.userName} VBoxManage controlvm "${settings.vm.vmName}" poweroff`, function(error, stdout, stderr){
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

    // TODO now it is possible that the service is started both as USER and as ROOT (but with config in the USER dir)
    app.get(`/${endpointName}/status`, connectEnsureLogin(), function (req, res) {
        log.info(`Call to /${endpointName}/status`);
        exec(`sudo -u ${settings.vm.userName} VBoxManage showvminfo "${settings.vm.vmName}" | grep State`, function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('running (') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('powered off (') > -1 || stdout.indexOf('aborted (') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(error + ' ' + stdout + '|' + stderr);
                res.send('error');
            }
        });
    });

};

module.exports = { bind };