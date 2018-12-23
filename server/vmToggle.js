#!/usr/bin/env node
/* eslint-env node */

const hobToggle = require('./hobToggle');
const settings = require('../settings.json');

const bind = function(app, log) {
  const bindToggle = hobToggle.hob({
    start: `sudo -u ${settings.vm.userName} VBoxManage startvm "${settings.vm.vmName}" --type headless`,
    stop: `sudo -u ${settings.vm.userName} VBoxManage controlvm "${settings.vm.vmName}" poweroff`,
    status: `sudo -u ${settings.vm.userName} VBoxManage showvminfo "${settings.vm.vmName}" | grep State`
  });
  bindToggle(app, 'vm', log);
};

module.exports = { bind };
