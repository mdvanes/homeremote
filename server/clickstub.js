#!/usr/bin/env node
/* eslint-env node */

const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app) {
    app.get('/clickstub/on', connectEnsureLogin(), function (req, res) {
        console.log('call to http://%s:%s/clickstub/on');
        // Expected result something like: Sending command[1] to deviceId[1]
        res.send({status: 'received'});
    });

    app.get('/clickstub/off', connectEnsureLogin(), function (req, res) {
        console.log('call to http://%s:%s/clickstub/off');
        res.send({status: 'received'});
    });
};

module.exports = {
    bind: bind
};