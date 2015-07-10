/**
 * Created by m.van.es on 10-7-2015.
 */
/* jshint node:true */
'use strict';

var request = require('request-promise'),
    root = 'https://192.168.0.8/radio/state.php?c=';

// TODO might be done with promises or generators?
var deferToBroek = function(res, action, cb) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self signed certificate
    request(root + action)
        .then(function(response) {
            var resObj = JSON.parse(response);

            // TODO succes should be with double s
            if(resObj.status && resObj.status === 'succes') {
                //res.send('ok');
                cb(resObj);
            } else {
                res.send('error');
            }
        });
};

var bind = function(app, log) {
    app.get('/radio/play', function (req, res) {
        log.info('radio: play');
        deferToBroek(res, 'play', function() {
            res.send('ok');
        });
    });

    app.get('/radio/stop', function (req, res) {
        deferToBroek(res, 'stop', function() {
            res.send('ok');
        });
    });

    app.get('/radio/info', function (req, res) {
        deferToBroek(res, 'info', function(resObj) {
            var mesg = resObj.message;
            mesg = mesg.split('ICY Info: StreamTitle=\''); // strip prefix
            if(mesg) {
                mesg = '\n' + mesg[1].substr(0, mesg[1].length - 3); // strip last 2 chars
                res.send(mesg);
            } else {
                res.send(resObj.message);
            }
        });
    });
};

module.exports = {
    bind: bind
};