#!/usr/bin/env node
/* eslint-env node */

const exec = require('../test/server/mockatoo').mock('child_process', 'shellStatus').exec;
const settings = require('../settings.json');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, endpointName, log) {

    const execPromise = (cmd, name, mapping) => {
        return new Promise((resolve, reject) => {
            /* eslint-disable complexity */
            exec(cmd, function(error, stdout, stderr) {

                if(stderr && stderr.length > 0 && stderr.indexOf('Connection refused') > -1) {
                    const result = 'Not found';
                    resolve({result, name});
                } else if(error || (stderr && stderr.length > 0)) {
                    log.error('Error executing ' + [error, stdout, stderr].join('|'));
                    reject(`Error executing ${cmd}`);
                } else if(!Array.isArray(mapping)) {
                    log.error('Config invalid ' + [error, stdout, stderr, mapping].join('|'));
                    reject(`Config invalid for ${cmd}`);
                } else if(!stdout && stdout.length <= 0) {
                    const result = 'No result';
                    resolve({result, name});
                } else {
                    const jsonOut = JSON.parse(stdout);
                    const result = mapping.reduce((acc, prop) => {
                        return acc + ' ' + jsonOut[prop];
                    }, '');

                    resolve({result, name});
                }
            });
            /* eslint-enable complexity */
        });
    };

    app.get(`/${endpointName}/status`, connectEnsureLogin(), function (req, res) {
        log.info(`call to /${endpointName}/status`);

        const execPromises = settings.shell.map(setting => {
            if(!(setting.cmd && setting.name && setting.mapping)) {
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