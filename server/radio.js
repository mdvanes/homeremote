#!/usr/bin/env node
'use strict';

//var request = require('request-promise'),
//    root = 'https://192.168.0.8/radio/state.php?c=';
var exec = require('child_process').exec;

// TODO might be done with promises or generators?
//var deferToBroek = function(res, action, cb) {
//    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self signed certificate
//    request(root + action)
//        .then(function(response) {
//            var resObj = JSON.parse(response);
//
//            // TODO succes should be with double s
//            if(resObj.status && resObj.status === 'succes') {
//                //res.send('ok');
//                cb(resObj);
//            } else {
//                res.send('error');
//            }
//        });
//};

var bind = function(app, log) {
    //app.get('/radio/play', function (req, res) {
    //    log.info('radio: play');
    //    deferToBroek(res, 'play', function() {
    //        res.send('ok');
    //    });
    //});
    //
    //app.get('/radio/stop', function (req, res) {
    //    deferToBroek(res, 'stop', function() {
    //        res.send('ok');
    //    });
    //});
    //
    //app.get('/radio/info', function (req, res) {
    //    deferToBroek(res, 'info', function(resObj) {
    //        var mesg = resObj.message;
    //        mesg = mesg.split('ICY Info: StreamTitle=\''); // strip prefix
    //        if(mesg) {
    //            mesg = '\n' + mesg[1].substr(0, mesg[1].length - 3); // strip last 2 chars
    //            res.send(mesg);
    //        } else {
    //            res.send(resObj.message);
    //        }
    //    });
    //});

    app.get('/radio/start', function (req, res) {
        console.log('call to http://%s:%s/radio/start');

        exec('sudo service playradio start', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio start/') > -1) {
                res.send({status: 'started'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/stop', function (req, res) {
        console.log('call to http://%s:%s/radio/stop');
        exec('sudo service playradio stop', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stderr);
                res.send('error');
            }
        });
    });

    app.get('/radio/status', function (req, res) {
        console.log('call to http://%s:%s/radio/status');
        exec('sudo service playradio status', function(error, stdout, stderr){
            log.info('['+stdout+']');
            if(stdout.indexOf('playradio start/') > -1) {
                res.send({status: 'started'});
            } else if(stdout.indexOf('playradio stop/') > -1) {
                res.send({status: 'stopped'});
            } else {
                log.error(stdout + '|' + stderr);
                res.send('error');
            }
        });
    });
};

module.exports = {
    bind: bind
};