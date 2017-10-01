#!/usr/bin/env node
/* eslint-env node */

module.exports = {
    mockExec: function(log, mockConfig) {
        return {
            exec: function exec(cmd, cb) {
                log.info(`Stubbed exec of "${cmd}" for "${mockConfig}"`);
                if(cmd === 'foo/1') {
                    cb(null, '{"bar": "baz", "bat": "man"}');
                } else {
                    cb(new Error(), '', 'Connection refused');
                }
            }
        }
    }
};