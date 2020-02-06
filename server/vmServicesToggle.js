#!/usr/bin/env node
/* eslint-env node */

const hobToggle = require('./hobToggle');
const settings = require('../settings.json');

const bind = function(app, log) {
  const bindToggle = hobToggle.hob({
    start: `${settings.vmservices.elevate} ssh -p ${settings.vmservices.port} ${settings.vmservices.user}@${settings.vmservices.host} '~/startServices.sh'`,
    stop: `${settings.vmservices.elevate} ssh -p ${settings.vmservices.port} ${settings.vmservices.user}@${settings.vmservices.host} '~/stopServices.sh'`,
    status: `${settings.vmservices.elevate} ssh -p ${settings.vmservices.port} ${settings.vmservices.user}@${settings.vmservices.host} '~/statusServices.sh'`,
  });
  bindToggle(app, 'vmservices', log);
};

module.exports = { bind };