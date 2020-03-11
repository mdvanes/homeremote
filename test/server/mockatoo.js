#!/usr/bin/env node
/* eslint-env node */

/*
Custom mocking middleware

example:

normal:
const exec = require('child_process').exec;

mocked:
const exec = require('../test/server/mockatoo').mock('child_process', 'shellStatus').exec;
 */

const bunyan = require('bunyan');
const path = require('path');

const log = bunyan.createLogger({
    name: 'Mockatoo',
    streams: [
        {
            level: 'info',
            stream: process.stdout // log INFO and above to stdout
        },
        {
            level: 'error',
            path: path.join(__dirname, '../../homeremote-error.log') // log ERROR and above to a file // TODO should be /var/tmp/homeremote-error.log ?
        }
    ]
});

function mock(toMock, mockConfig) {
    let debug = false;
    process.argv.forEach(function (val, index) {
        // Detect debug mode
        if(index === 2 && val === '--debugremote') {
            debug = true;
        }
    });
    //debug = false;

    if(debug) {
        log.info(`Mocking calls to ${toMock} for ${mockConfig}`);
        const mockConfigFile = require(`../../test/server/${mockConfig}.mock`);
        return mockConfigFile.mockExec(log, mockConfig);
    }

    return require(toMock);
}

module.exports = { mock };