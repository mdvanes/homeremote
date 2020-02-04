#!/usr/bin/env node
/* eslint-env node */

const settings = require('../settings.json');
const rp = require('request-promise');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app, log) {

    app.get('/switches', connectEnsureLogin(), (req, res) => {
        log.info(`Call to http://${req.get('host')}/switches domoticzuri: ${settings.domoticzuri}]`);
        if(settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=devices&used=true&filter=all&favorite=1`;
            rp(targetUri)
              .then(function (remoteResponse) {
                  const remoteResponseJson = JSON.parse(remoteResponse);
                  if(remoteResponseJson.status === 'OK') {
                      const switches = remoteResponseJson.result.map(({idx, Type, Name, Status, SwitchType, Level, Protected }) => ({
                          idx,
                          type: SwitchType === 'Selector' ? SwitchType : Type,
                          name: Name,
                          status: Status,
                          dimLevel: (SwitchType === 'Dimmer' && Status === 'On') || SwitchType === 'Selector' ? Level : null,
                          readOnly: Protected
                      }));
                      res.send({
                          status: 'received',
                          switches
                      });
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

    app.post('/switch/:id', connectEnsureLogin(), (req, res) => {
        const switchId = req.params.id;
        const switchType = req.body.type;
        const newState = req.body.state === 'on' ? 'On' : 'Off';

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