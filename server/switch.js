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
                      const switches = remoteResponseJson.result.map(item => ({
                          idx: item.idx,
                          type: item.Type,
                          name: item.Name,
                          status: item.Status,
                          dimLevel: item.SwitchType === 'Dimmer' && item.Status === 'On' ? item.Level : null
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