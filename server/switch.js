#!/usr/bin/env node
'use strict';

var exec = require('child_process').exec;
var settings = require('../settings.json');
var rp = require('request-promise');

var bind = function(app, log) {

    app.get('/switch:id/:state', function (req, res) {
        var switchId = req.params.id;
        var switchState = 0;
        if(req.params.state === 'on') {
            switchState = 1;
        }

        if(settings.heserverip === '') {
            console.log('call to http://%s:%s/switch' + switchId + '/' + req.params.state + ' [path: ' + settings.hepath + ']');

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
        } else {
            console.log('call to http://%s:%s/switch' + switchId + '/' + req.params.state + ' [path: ' + settings.hepath + ']');
            rp(settings.heserverip + '/switch' + req.params.id + '/' + req.params.state)
                .then(function (remoteReponse) {
                    log.info('remoteResponse: ' + remoteReponse); // TODO handle errors
                    res.send({status: 'received'});
                })
                .catch(function (err) {
                    log.error(err);
                    res.send({status: 'error'});
                });
        }

    });
};

module.exports = {
    bind: bind
};