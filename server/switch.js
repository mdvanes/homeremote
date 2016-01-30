/* jshint node:true */
'use strict';

var exec = require('child_process').exec;

var bind = function(app, log) {
    app.get('/switch1/on', function (req, res) {
        console.log('call to http://%s:%s/clickstub/on');
        // Call should be: /home/martin/elro/he853-remote/he853 001 1
        // TODO path to bin should be from server side configuration
        // Expected result something like: Sending command[1] to deviceId[1]

        exec('sudo /home/martin/elro/he853-remote/he853 001 1', function(error, stdout, stderr){
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
        exec('sudo /home/martin/elro/he853-remote/he853 001 0', function(error, stdout, stderr){
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