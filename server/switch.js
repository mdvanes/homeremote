#!/usr/bin/env node

var exec = require('child_process').exec;
var fs = require('fs');
var settings = require('../settings.json');

var bind = function(app, log) {

    app.get('/switch:id/:state', function (req, res) {
        var switchId = req.params.id;
        var switchState = 'off';
        if(req.params.state === '1') {
            switchState = 'on';
        }

        console.log('call to http://%s:%s/switch' + switchId + '/' + switchState + ' [path: ' + settings.hepath + ']');

        // Call should be: sudo /path/he853 001 1
        exec('sudo ' + settings.hepath + '/he853 00' + switchId + ' ' + switchState, function(error, stdout, stderr){
            log.info('['+stdout+']');
            // Expected result something like: Sending command[1] to deviceId[1]
            if(stdout.indexOf('Sending command[') > -1) {
                res.send({status: 'received'});
            } else {
                log.error(stderr);
                res.send({status: 'error'});
            }
        });
    });
};

module.exports = {
    bind: bind
};