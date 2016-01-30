#!/usr/bin/env node
'use strict';

var bind = function(app) {
    app.get('/clickstub/on', function (req, res) {
        console.log('call to http://%s:%s/clickstub/on');
        // Expected result something like: Sending command[1] to deviceId[1]
        res.send({status: 'received'});
    });

    app.get('/clickstub/off', function (req, res) {
        console.log('call to http://%s:%s/clickstub/off');
        res.send({status: 'received'});
    });
};

module.exports = {
    bind: bind
};