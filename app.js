/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express'),
    app = express(),
    bunyan = require('bunyan'),
    broadcast = require('./server/broadcast.js'),
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
app.use(express.static('public'));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    log.info('HomeRemote listening at http://' + host + ':' + port);
});
