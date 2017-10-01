#!/usr/bin/env node
/* eslint-env node */

module.exports = {
    mockExec: function(log) {
        return function exec(cmd, cb) {
            log.info(`Stubbed exec of "${cmd}"`);
            cb(null, '{"bar": "baz", "bat": "man"}');
        }
    }
};