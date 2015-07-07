/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express');
var exec = require('child_process').exec;
var app = express();

var debug = false;

// TODO debug mode that works on Windows
// Detect debug mode
process.argv.forEach(function (val, index) {
    if(index === 2 && val === '--debugremote') {
        console.warn('Running in debug mode!');
        debug = true;
    }
});


/* start: broadcast module TODO convert to real module */
app.get('/broadcast/start', function (req, res) {
    console.log('call to http://%s:%s/broadcast/start');

    if(debug) {
        setTimeout(function() {
            console.warn('debug: always return OK after 1 sec delay');
            res.send('ok');
        }, 1000);
    } else {
        setTimeout(function() {
            exec('git config --global user.name', function(error, stdout, stderr){
                console.log('['+stdout+']', stderr);
                if(stdout.indexOf('m.van.es') > -1) {
                    res.send('ok');
                } else {
                    res.send('error');
                    //throw new Error('unexpected response');
                }
            });
        }, 1000);
    }
});

app.get('/broadcast/stop', function (req, res) {
    console.log('call to http://%s:%s/broadcast/stop');

    exec('git config --global user.name', function(error, stdout, stderr){
        console.log('['+stdout+']', stderr);
        if(stdout.indexOf('m.van.es') > -1) {
            res.send('ok');
        } else {
            res.send('error');
        }
    });
});

app.get('/broadcast/status', function (req, res) {
    console.log('call to http://%s:%s/broadcast/status');

    // cmd: sudo service broadcastxxx status
    //
    // options:
    //    broadcastxxx stop/waiting                - when stopped, also the begin of the response of successful stop (multiline response)
    //    broadcastxxx start/running, process 1111 - when started, pid is changed of course, also the response of successful start

    // return: running or waiting

    res.send('stopped');
});
/* end: broadcast module */

app.use(express.static('public'));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('HomeRemote listening at http://%s:%s', host, port);

});
