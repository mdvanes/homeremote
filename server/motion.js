// #!/usr/bin/env node
// /* eslint-env node */
//
// const exec = require('child_process').exec;
// const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;
//
// const bind = function(app, log) {
//
//     app.get('/motion/start', connectEnsureLogin(), function (req, res) {
//         log.info('call to /motion/start');
//         exec('sudo service motion start', function(error, stdout, stderr){
//             log.info('['+stdout+']');
//             // TODO Upstart gave more information when starting/stopping, do a better check for systemd
//             //if(stdout.indexOf('motion start/') > -1) {
//             if(stdout.length === 0) {
//                 res.send({status: 'started'});
//             } else {
//                 log.error(stderr);
//                 res.send('error');
//             }
//         });
//     });
//
//     app.get('/motion/stop', connectEnsureLogin(), function (req, res) {
//         log.info('call to /motion/stop');
//         exec('sudo service motion stop', function(error, stdout, stderr){
//             log.info('['+stdout+']');
//             // TODO Upstart gave more information when starting/stopping, do a better check for systemd
//             //if(stdout.indexOf('motion stop/') > -1) {
//             if(stdout.length === 0) {
//                 res.send({status: 'stopped'});
//             } else {
//                 log.error(stderr);
//                 res.send('error');
//             }
//         });
//     });
//
//     app.get('/motion/status', connectEnsureLogin(), function (req, res) {
//         log.info('call to /motion/status');
//         exec('sudo service motion status', function(error, stdout, stderr){
//             log.info('['+stdout+']');
//             if(stdout.indexOf('Active: active') > -1) {
//                 res.send({status: 'started'});
//             } else if(stdout.indexOf('Active: failed') > -1 || stdout.indexOf('Active: inactive') > -1) {
//                 res.send({status: 'stopped'});
//             } else {
//                 log.error(stdout + '|' + stderr);
//                 res.send('error');
//             }
//         });
//     });
//
// };
//
// module.exports = {
//     bind: bind
// };