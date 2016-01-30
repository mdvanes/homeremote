/* jshint node:true */
'use strict';

var exec = require('child_process').exec;
var fs = require('fs');
var settings = require('../settings.json');
//var settings = JSON.parse(fs.readFileSync('./settings.json'));

var bind = function(app, log) {
    app.get('/switch1/on', function (req, res) {
        console.log('call to http://%s:%s/switch1/on --- ' + settings.hepath);
        // Call should be: /home/martin/elro/he853-remote/he853 001 1
        // TODO path to bin should be from server side configuration
        // Expected result something like: Sending command[1] to deviceId[1]

        exec('sudo ' + settings.hepath + '/he853 001 1', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('Sending command[') > -1) {
                res.send({status: 'received'});
            } else {
                log.error(stderr);
                res.send({status: 'error'});
            }
        });
    });

    app.get('/switch1/off', function (req, res) {
        console.log('call to http://%s:%s/switch1/off');
        exec('sudo ' + settings.hepath + '/he853 001 0', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('Sending command[') > -1) {
                res.send({status: 'received'});
            } else {
                log.error(stderr);
                res.send({status: 'error'});
            }
        });
    });

    app.get('/switch2/on', function (req, res) {
        console.log('call to http://%s:%s/switch2/on');
        // Call should be: /home/martin/elro/he853-remote/he853 001 1
        // TODO path to bin should be from server side configuration
        // Expected result something like: Sending command[1] to deviceId[1]

        exec('sudo /home/martin/elro/he853-remote/he853 002 1', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('Sending command[') > -1) {
                res.send({status: 'received'});
            } else {
                log.error(stderr);
                res.send({status: 'error'});
            }
        });
    });

    app.get('/switch2/off', function (req, res) {
        console.log('call to http://%s:%s/switch2/off');
        exec('sudo /home/martin/elro/he853-remote/he853 002 0', function(error, stdout, stderr){
            log.info('['+stdout+']');
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