#!/usr/bin/env node
/* eslint-env node */

const hobToggle = require('./hobToggle');

const createServiceSettings = settingName => ({
  start: `sudo service ${settingName} start`,
  stop: `sudo service ${settingName} stop`,
  status: `sudo service ${settingName} status`
});


const bind = function(app, name, log) {
  const bindToggle = hobToggle.hob(createServiceSettings(name));
  bindToggle(app, name, log);
};

module.exports = { bind };
