#!/usr/bin/env node
/* eslint-env node */

module.exports = {
    // TODO two separate returns
    mockExec: function(log, mockConfig) {
        return {
            exec: function exec(cmd, cb) {
                log.info(`Stubbed exec of "${cmd}" for "${mockConfig}"`);
                cb(null, '{"bar": "baz", "bat": "man"}');
            }
        }
    }
};