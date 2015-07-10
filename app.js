/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express'),
    app = express(),
    bunyan = require('bunyan'),
    //request = require('request-promise'),
    //http = require('http'),
    broadcast = require('./server/broadcast.js'),
    radio = require('./server/radio.js'),
    debug = false;

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

// Detect debug mode
process.argv.forEach(function (val, index) {
    if(index === 2 && val === '--debugremote') {
        //console.warn('Running in debug mode!');
        log.warn('Running in debug mode!');
        debug = true;
    }
});

broadcast.bind(app, log, debug);
radio.bind(app, log, debug);
app.use(express.static('public'));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    log.info('HomeRemote listening at http://' + host + ':' + port);

    //request('http://localhost:3000/test.json', function(error, response, body) {
    //    var x = error, y = response;//
    //    log.info(body);
    //    log.info(y);
    //});
    //request('http://localhost:3000/test.json')
    //    .then(function(response) {
    //        var z = JSON.parse(response);
    //        log.info('z:', z.key);
    //    });

    //process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // allow self signed certificate
    //request('https://192.168.0.8/radio/state.php?c=play')
    //    .then(function(response) {
    //        var z = JSON.parse(response);
    //        log.info('z1:', z.status);
    //    });


    //var options = {
    //    hostname: 'localhost',
    //    port: 3000,
    //    path: 'test.json'
    //};
    //console.log(options);
    //http.request(options, function(response) {
    //    response.on('data', function(data) {
    //        var x = JSON.parse(data);
    //        console.log('x', x);
    //    })
    //    //var x = error, y = response;//
    //    //log.info(body);
    //    //log.info(y);
    //});
});
