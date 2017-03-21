#!/usr/bin/env node
/* eslint-env node */

let express = require('express'),
    app = express(),
    http = require('http'),
    https = require('https'),
    fs = require('fs'),
    path = require('path'),
    auth = require('http-auth'),
    bunyan = require('bunyan'),
    broadcast = require('./broadcast.js'),
    radio = require('./radio.js'),
    motion = require('./motion.js'),
    togglestub = require('./togglestub.js'),
    clickstub = require('./clickstub.js'),
    switcher = require('./switch.js'),
    filemanager = require('./fm.js'),
    getMusic = require('./getMusic.js'),
    gears = require('./gears.js'),
    settings = require('../settings.json'),
    debug = false;

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json

// Configuration
let log = bunyan.createLogger({
    name: 'HomeRemote',
    streams: [
        {
            level: 'info',
            stream: process.stdout // log INFO and above to stdout
        },
        {
            level: 'error',
            path: path.join(__dirname, '../homeremote-error.log') // log ERROR and above to a file // TODO should be /var/tmp/homeremote-error.log ?
        }
    ]
});

let basic = auth.basic({
    realm: 'HomeRemote', // pages with the same root URL and realm share credentials
    file: path.join(__dirname, '../users.htpasswd')
});

let options = {
    key: fs.readFileSync('keys/server.key'),
    cert: fs.readFileSync('keys/server.cert')
};

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
motion.bind(app, log, debug);
togglestub.bind(app);
clickstub.bind(app);
switcher.bind(app, log);
filemanager.bind(app, log);
getMusic.bind(app, log);
gears.bind(app, log);

if(typeof settings.enableAuth === 'undefined' || settings.enableAuth) {
    // default is true
    app.use(
        auth.connect(basic),
        express.static('public')
    );
} else {
    app.use(
        express.static('public')
    );
}

http.createServer(app).listen(3000, () => log.info('HomeRemote listening at http://localhost:3000') );
https.createServer(options, app).listen(3443, () => log.info('HomeRemote listening at https://localhost:3443') );