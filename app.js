/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express'),
    app = express(),
    bunyan = require('bunyan'),
    broadcast = require('./server/broadcast.js'),
    radio = require('./server/radio.js'),
    togglestub = require('./server/togglestub.js'),
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

// Read application arguments
process.argv.forEach(function (val, index) {
    // Detect debug mode
    if(index === 2 && val === '--debugremote') {
        log.warn('Running in debug mode!');
        debug = true;
    }
});

// Set routes
broadcast.bind(app, log, debug);
radio.bind(app, log, debug);
togglestub.bind(app, log, debug);
app.use(express.static('public'));

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    log.info('HomeRemote listening at http://' + host + ':' + port);
});
