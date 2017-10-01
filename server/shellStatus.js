#!/usr/bin/env node
/* eslint-env node */

const exec = require('../test/server/mockatoo').mock(require('child_process').exec, require('../test/server/shellStatus.mock'));
const settings = require('../settings.json');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, endpointName, log) {

    const execPromise = (cmd, name, mapping) => {
        return new Promise((resolve, reject) => {
            exec(cmd, function(error, stdout, stderr){
                if(stdout.length > 0 && Array.isArray(mapping)) {
                    const jsonOut = JSON.parse(stdout);
                    const result = mapping.reduce((acc, prop) => {
                        return acc + ' ' + jsonOut[prop];
                    }, '');

                    resolve({result, name});
                } else {
                    log.error(error + ' ' + stdout + '|' + stderr);
                    reject();
                }
            });
        });
    };

    app.get(`/${endpointName}/status`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/status`);

        const execPromises = settings.shell.map(setting => {
            if(!setting.cmd || !setting.name || !setting.mapping) {
                res.send({status: 'error', message: 'invalid setting properties'});
                return;
            }
            return execPromise(setting.cmd, setting.name, setting.mapping);
        });

        Promise.all(execPromises)
            .then(data => {
                res.send({status: 'ok', entries: data});
            })
            .catch(err => {
                log.error(err);
                res.send({status: 'error'});
            });
    });

};

module.exports = {bind};