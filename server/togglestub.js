#!/usr/bin/env node
/* eslint-env node */

const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

const bind = function(app) {
    app.get('/togglestub/start', connectEnsureLogin(), function (req, res) {
        console.log('call to http://%s:%s/togglestub/start');
        res.send({status: 'started'});
    });

    app.get('/togglestub/stop', connectEnsureLogin(),function (req, res) {
        console.log('call to http://%s:%s/togglestub/stop');
        res.send({status: 'stopped'});
    });

    app.get('/togglestub/status', connectEnsureLogin(),function (req, res) {
        console.log('call to http://%s:%s/togglestub/status');
        if(Math.random() < 0.5) {
            res.send({status: 'started'});
        } else {
            res.send({status: 'stopped'});
        }
    });
};

module.exports = {
    bind: bind
};