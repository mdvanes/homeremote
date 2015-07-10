/**
 * Created by m.van.es on 7-7-2015.
 */
/* jshint node:true */
'use strict';

var exec = require('child_process').exec;

var bind = function(app, log, debug) {
    app.get('/broadcast/start', function (req, res) {
        console.log('call to http://%s:%s/broadcast/start');

        if(debug) {
            setTimeout(function() {
                log.warn('debug: always return OK after 1 sec delay');
                res.send('ok');
            }, 1000);
        } else {
            exec('sudo service broadcast3fm start', function(error, stdout, stderr){
                log.info('['+stdout+']');
                if(stdout.indexOf('broadcast3fm start/') > -1) {
                    res.send('ok');
                } else {
                    log.error(stderr);
                    res.send('error');
                }
            });
        }
    });

    app.get('/broadcast/stop', function (req, res) {
        if(debug) {
            log.warn('debug: /broadcast/stop always return ok');
            res.send('ok');
        } else {
            exec('sudo service broadcast3fm stop', function(error, stdout, stderr){
                log.info('['+stdout+']');
                if(stdout.indexOf('broadcast3fm stop/') > -1) {
                    res.send('ok');
                } else {
                    log.error(stderr);
                    res.send('error');
                }
            });
        }
    });

    app.get('/broadcast/status', function (req, res) {
        // cmd: sudo service broadcastxxx status
        //
        // options:
        //    broadcastxxx stop/waiting                - when stopped, also the begin of the response of successful stop (multiline response)
        //    broadcastxxx stop/post-stop
        //    broadcastxxx start/running, process 1111 - when started, pid is changed of course, also the response of successful start
        //    broadcastxxx start/post-stop

        // return: running or waiting

        if(debug) {
            log.warn('debug: /broadcast/status always return waiting');
            res.send('waiting');
        } else {
            exec('sudo service broadcast3fm status', function(error, stdout, stderr){
                log.info('['+stdout+']');
                if(stdout.indexOf('broadcast3fm start/') > -1) {
                    res.send('running');
                } else if(stdout.indexOf('broadcast3fm stop/') > -1) {
                    res.send('waiting');
                } else {
                    log.error(stdout + '|' + stderr);
                    res.send('error');
                }
            });
        }
    });
};

module.exports = {
    bind: bind
};