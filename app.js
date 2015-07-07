/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express');
var exec = require('child_process').exec;
var app = express();

var bunyan = require('bunyan');
var log = bunyan.createLogger({
    name: 'HomeRemote',
    streams: [
        {
            level: 'info',
            stream: process.stdout          // log INFO and above to stdout
        },
        {
            level: 'error',
            path: './homeremote-error.log'  // log ERROR and above to a file // TODO should be /var/tmp/homeremote-error.log ?
        }
    ]
});

var debug = false;

// TODO debug mode that works on Windows
// Detect debug mode
process.argv.forEach(function (val, index) {
    if(index === 2 && val === '--debugremote') {
        //console.warn('Running in debug mode!');
        log.warn('Running in debug mode!');
        debug = true;
    }
});


/* start: broadcast module TODO convert to real module */
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
            if(stdout.indexOf('broadcast3fm start/running') > -1) {
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
            if(stdout.indexOf('broadcast3fm stop/waiting') > -1) {
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
    //    broadcastxxx start/running, process 1111 - when started, pid is changed of course, also the response of successful start

    // return: running or waiting

    if(debug) {
        log.warn('debug: /broadcast/status always return waiting');
        res.send('waiting');
    } else {
        exec('sudo service broadcast3fm status', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('broadcast3fm start/running') > -1) {
                res.send('running');
            } else if(stdout.indexOf('broadcast3fm stop/waiting') > -1) {
                res.send('waiting');
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    }
});
/* end: broadcast module */


app.use(express.static('public'));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    log.info('HomeRemote listening at http://' + host + ':' + port);
});
