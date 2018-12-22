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
      if(error && error.code > 0) {
        reject(`${error.code} ${stdout} ${stderr}`);
      } else {
        resolve(stdout);
      }
    })
  ))
);

async function bindAction(app, endpointName, log, settings, type, statusCode, actions) {
  app.get(`/${endpointName}/${type}`, connectEnsureLogin(), async (req, res) => {
    try {
      log.info(`call to /${endpointName}/${type}`);
      const stdout = await execPromise(settings[type]);
      log.info(`/${endpointName}/${type} stdout [${stdout}]`);
      // if(stdout.length === 0) {
      //   res.send({status: statusCode});
      // } else {
      //   throw new Error('unexpected');
      // }
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
      res.send('error');
    }
  })
}

//   (app
//   .get(`/${endpointName}/start`, connectEnsureLogin(), (req, res) => {
//     log.info(`call to /${endpointName}/start`);
//
//     exec(settings.start, (error, stdout, stderr) => {
//         log.info('['+stdout+']');
//         // TODO Upstart gave more information when starting/stopping, do a better check for systemd
//         //if(stdout.indexOf('playradio start/') > -1) {
//         if(stdout.length === 0) {
//             res.send({status: 'started'});
//         } else {
//             log.error(error + ' ' + stderr);
//             res.send('error');
//         }
//     });
// }));

// app.get(settings.stop, connectEnsureLogin(), function (req, res) {
//     log.info(`call to /${endpointName}/stop`);
//     exec(`sudo service ${settings} stop`, function(error, stdout, stderr){
//         log.info('['+stdout+']');
//         // TODO Upstart gave more information when starting/stopping, do a better check for systemd
//         //if(stdout.indexOf('playradio stop/') > -1) {
//         if(stdout.length === 0) {
//             res.send({status: 'stopped'});
//         } else {
//             log.error(error + ' ' + stderr);
//             res.send('error');
//         }
//     });
// });
//

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

// app.get(`/${endpointName}/status`, connectEnsureLogin(), (req, res) => {
//     log.info(`call to /${endpointName}/status`);
//     exec(settings.status, (error, stdout, stderr) => {
//         log.info('stdout: ['+stdout+']', isStartedCondition);
//         if(stdout.indexOf(isStartedCondition) > -1) {
//             console.log('IS STARTED')
//             res.send({status: 'started'});
//         } else if(isStopped(stdout)) {
//             res.send({status: 'stopped'});
//         } else {
//             log.error(error + ' ' + stdout + '|' + stderr);
//             res.send('error');
//         }
//     });
// });

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

  // const isStartedCondition = settings.isStarted
  //   ? settings.isStarted
  //   : 'Active: active'
  // ;
  //
  // const isStopped = stdout => (settings.isStopped
  //   ? stdout.indexOf(settings.isStopped[0]) > -1 || stdout.indexOf(settings.isStopped[0]) > -1
  //   : stdout.indexOf('Active: failed') > -1 || stdout.indexOf('Active: inactive') > -1
  // );

  // {
  //   return settings.isStopped ? 1 : 0;
  //   // return settings.isStopped
  //   //   ? stdout.indexOf('powered off (') > -1 || stdout.indexOf('aborted ('
  //   //   : stdout.indexOf('Active: failed') > -1 || stdout.indexOf('Active: inactive') > -1;
  // }
};

// TODO needs cleaning and tests

// TODO test on dev machine without mock -- apparently very difficult...
// It works starting and stopping once, than hangs

module.exports = {
  hob,
  bindAction
};