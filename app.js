#!/usr/bin/env node

var express = require('express'),
    app = express(),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    bunyan = require('bunyan'),
    broadcast = require('./server/broadcast.js'),
    radio = require('./server/radio.js'),
    togglestub = require('./server/togglestub.js'),
    clickstub = require('./server/clickstub.js'),
    switcher = require('./server/switch.js'),
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
togglestub.bind(app);
clickstub.bind(app);
switcher.bind(app, log);
app.use(express.static('public'));

var options = {
    key: fs.readFileSync('keys/localhost.key'),
    cert: fs.readFileSync('keys/localhost.cert')
};
http.createServer(app).listen(3000, () => log.info('HomeRemote listening at http://localhost:3000') );
https.createServer(options, app).listen(3443, () => log.info('HomeRemote listening at https://localhost:3443') );