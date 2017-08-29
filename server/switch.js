#!/usr/bin/env node
/* eslint-env node */

const settings = require('../settings.json');
const rp = require('request-promise');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, log) {

    app.post('/switch/:id', connectEnsureLogin(), function (req, res) {
        const switchId = req.params.id;
        const switchType = req.body.type;
        let newState = 'Off';
        if(req.body.state === 'on') {
            newState = 'On';
        }

        log.info(`Call to http://${req.get('host')}/switch/${switchId} [state: ${newState} domoticzuri: ${settings.domoticzuri}]`);
        if(settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=command&param=${switchType}&idx=${switchId}&switchcmd=${newState}`;
            rp(targetUri)
                .then(function (remoteResponse) {
                    const remoteResponseJson = JSON.parse(remoteResponse);
                    if(remoteResponseJson.status === 'OK') {
                        res.send({status: 'received'});
                    } else {
                        throw new Error('remoteResponse failed');
                    }
                })
                .catch(function (err) {
                    log.error(err);
                    res.send({status: 'error'});
                });
        } else {
            log.error('domoticzuri not configured');
            res.send({status: 'error'});
        }
    });
};

module.exports = {bind};