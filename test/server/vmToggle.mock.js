#!/usr/bin/env node
/* eslint-env node */

module.exports = {
    mockExec: function(log, mockConfig) {
        return {
            exec: function exec(cmd, cb) {
                log.info(`Stubbed exec of "${cmd}" for "${mockConfig}"`);
                cb(null, 'running (');
            }
        }
    }
};