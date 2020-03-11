#!/usr/bin/env node
/* eslint-env node */

const settings = require('../settings.json');
const rp = require('request-promise');
// const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const getIsOnDimmer = (SwitchType, Status) =>
    SwitchType === 'Dimmer' && Status === 'On';

const getDimLevel = (isOnDimmer, isSelector, Level) =>
    isOnDimmer || isSelector ? Level : null;

// For switches included in a scene
const mapIncludedSwitch = SceneStatus => ({ DevID, Type, Name }) => ({
    idx: DevID,
    type: Type,
    name: Name,
    status: SceneStatus,
    dimLevel: null, // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
    readOnly: false // NYI, to implement this get each switch detail by DevID on /json.htm?type=command&param=getlightswitches
});

const getChildren = async (SceneIdx, SceneType, SceneStatus) => {
    if (SceneType === 'Group') {
        const targetUri = `${settings.domoticzuri}/json.htm?type=command&param=getscenedevices&idx=${SceneIdx}&isscene=true`;
        const remoteResponse = await rp(targetUri);
        const remoteResponseJson = JSON.parse(remoteResponse);
        if (remoteResponseJson.status === 'OK') {
            return remoteResponseJson.result.map(
                mapIncludedSwitch(SceneStatus)
            );
        }
        return false;
    }
    return false;
};

const mapSwitch = async ({
    idx,
    Type,
    Name,
    Status,
    SwitchType,
    Level,
    Protected
}) => {
    const isSelector = SwitchType === 'Selector';
    const isOnDimmer = getIsOnDimmer(SwitchType, Status);
    const children = await getChildren(idx, Type, Status);
    const switchResult = {
        idx,
        type: isSelector ? SwitchType : Type,
        name: Name,
        status: Status,
        dimLevel: getDimLevel(isOnDimmer, isSelector, Level),
        readOnly: Protected,
        children
    };
    return switchResult;
};

const bind = function(app, log, connectEnsureLogin) {
    app.get('/switches', connectEnsureLogin(), async (req, res) => {
        log.info(
            `Call to http://${req.get('host')}/switches domoticzuri: ${
                settings.domoticzuri
            }]`
        );
        if (settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=devices&used=true&filter=all&favorite=1`;
            try {
                const remoteResponse = await rp(targetUri);
                const remoteResponseJson = JSON.parse(remoteResponse);
                if (remoteResponseJson.status === 'OK') {
                    const switches = await Promise.all(
                        remoteResponseJson.result.map(mapSwitch)
                    );
                    // console.log('SWITCHES', switches);
                    res.send({
                        status: 'received',
                        switches
                    });
                } else {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error('remoteResponse failed');
                }
            } catch (err) {
                log.error(err);
                res.send({ status: 'error' });
            }
        } else {
            log.error('domoticzuri not configured');
            res.send({ status: 'error' });
        }
    });

    app.post('/switch/:id', connectEnsureLogin(), (req, res) => {
        const switchId = req.params.id;
        const switchType = req.body.type;
        const newState = req.body.state === 'on' ? 'On' : 'Off';

        log.info(
            `Call to http://${req.get(
                'host'
            )}/switch/${switchId} [state: ${newState} domoticzuri: ${
                settings.domoticzuri
            }]`
        );
        if (settings.domoticzuri && settings.domoticzuri.length > 0) {
            const targetUri = `${settings.domoticzuri}/json.htm?type=command&param=${switchType}&idx=${switchId}&switchcmd=${newState}`;
            rp(targetUri)
                .then(function(remoteResponse) {
                    const remoteResponseJson = JSON.parse(remoteResponse);
                    if (remoteResponseJson.status === 'OK') {
                        res.send({ status: 'received' });
                    } else {
                        throw new Error('remoteResponse failed');
                    }
                })
                .catch(function(err) {
                    log.error(err);
                    res.send({ status: 'error' });
                });
        } else {
            log.error('domoticzuri not configured');
            res.send({ status: 'error' });
        }
    });
};

module.exports = { bind };
