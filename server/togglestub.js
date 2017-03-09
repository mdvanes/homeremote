#!/usr/bin/env node
/* eslint-env node */

var bind = function(app) {
    app.get('/togglestub/start', function (req, res) {
        console.log('call to http://%s:%s/togglestub/start');
        res.send({status: 'started'});
    });

    app.get('/togglestub/stop', function (req, res) {
        console.log('call to http://%s:%s/togglestub/stop');
        res.send({status: 'stopped'});
    });

    app.get('/togglestub/status', function (req, res) {
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