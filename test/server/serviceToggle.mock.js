#!/usr/bin/env node
/* eslint-env node */

module.exports = {
    mockExec: function(log, mockConfig) {
        return {
            exec: function exec(cmd, cb) {
                log.info(`Stubbed exec of "${cmd}" for "${mockConfig}"`);
                if(cmd === 'sudo service playradio status') {
                    cb(null, 'Active: active');
                } else if(cmd === 'sudo service motion status') {
                    cb(null, 'Active: active');
                } else {
                    cb(null, 'Active: inactive');
                }
            }
        }
    }
};