#!/usr/bin/env node
/* eslint-env node */

const exec = require('../test/server/mockatoo').mock('child_process', 'serviceToggle').exec;
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;

/**
 * Utilities for binding service toggles
 */

// Promisified exec
const execPromise = startCmd => (
  new Promise((resolve, reject) => (
    exec(startCmd, (error, stdout, stderr) => {
      // Note: error.code = 3 when service "Active: inactive (dead)" or "Active: failed"
      if(error && error.code > 0 && error.code !== 3) {
        reject(`${error.code} ${stdout} ${stderr}`);
      } else {
        const exitCode = error && error.code;
        resolve({stdout, exitCode});
      }
    })
  ))
);

async function bindAction(app, endpointName, log, settings, type, statusCode, actions) {
  app.get(`/${endpointName}/${type}`, connectEnsureLogin(), async (req, res) => {
    try {
      log.info(`call to /${endpointName}/${type}`);
      const {stdout, exitCode} = await execPromise(settings[type]);
      log.info(`/${endpointName}/${type} stdout [${stdout}] [${exitCode}]`);
      // Abstract action selection that scales to unlimited conditions
      const selectedAction = actions
        .filter(action => action.condition(stdout))
        .reduce((acc, action) => {
          // By design, reduce will only keep the last match when the accumulator
          // is ignored, so the order inside the actions array has significance.
          return action.action;
        }, () => {
          throw new Error('Unexpected');
        });
      selectedAction(res, statusCode);
    } catch(err) {
      log.error(`Failed ${endpointName} ${type}`, err);
      res.send({status: 'error'});
    }
  })
}

/* Actions for start or stop */
const startStopActions = [
  {
    condition: stdout => stdout.length === 0,
    action: (res, statusCode) => res.send({status: statusCode})
  },
  /* VM actions */
  /* Split actions for vm to other? */
  {
    condition: stdout => stdout.indexOf('has been successfully started') > -1,
    action: res => res.send({status: 'started'})
  },
  {
    condition: stdout => stdout.indexOf('100%') > -1,
    action: res => res.send({status: 'stopped'})
  }
];

/* Actions for status */
const statusActions = [
  {
    condition: stdout => stdout.indexOf('Active: active') > -1,
    action: res => res.send({status: 'started'})
  },
  {
    condition: stdout => stdout.indexOf('Active: failed') > -1 || stdout.indexOf('Active: inactive') > -1,
    action: res => res.send({status: 'stopped'})
  },
  /* VM actions */
  /* Split actions for vm to other? */
  {
    condition: stdout => stdout.indexOf('running (') > -1,
    action: res => res.send({status: 'started'})
  },
  {
    condition: stdout => stdout.indexOf('powered off (') > -1 || stdout.indexOf('aborted (') > -1,
    action: res => res.send({status: 'stopped'})
  }
];

/**
 *  HOB - Higher Order Bind
 *  Takes settings and applies it to a bind function.
 *
 *  That bind function binds 3 endpoints: start, stop, status
 *
 *  This is done because the conditions for being started or stopped can differ
 *  for each service.
 *
 *  @example
 *  const bindRadioToggle = serviceToggle.hob({
 *    start: 'sudo service playradio start',
 *    stop: 'sudo service playradio stop',
 *    status: 'sudo service playradio status'
 *  });
 *  bindRadioToggle(app, 'radio', log);
 */
const hob = settings => {

  return (app, endpointName, log) => {
    bindAction(
      app,
      endpointName,
      log,
      settings,
      'start',
      'started',
      startStopActions
    );
    bindAction(
      app,
      endpointName,
      log,
      settings,
      'stop',
      'stopped',
      startStopActions
    );
    bindAction(
      app,
      endpointName,
      log,
      settings,
      'status',
      null,
      statusActions
    );
  };
};

module.exports = {
  hob,
  bindAction
};