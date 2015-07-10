/**
 * Created by m.van.es on 10-7-2015.
 */
/* jshint node:true */
'use strict';

var request = require('request-promise');

var root = 'https://192.168.0.8/radio/state.php?c=';

function bind(app, log) {
    app.get('/radio/play', function (req, res) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self signed certificate
        request(root + 'play')
            .then(function(response) {
                var resObj = JSON.parse(response);

                // TODO succes should be with double s
                if(resObj.status && resObj.status === 'succes') {
                    res.send('ok');
                } else {
                    res.send('error');
                }
            });
    });

    app.get('/radio/stop', function (req, res) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self signed certificate
        request(root + 'stop')
            .then(function(response) {
                var resObj = JSON.parse(response);

                // TODO succes should be with double s
                if(resObj.status && resObj.status === 'succes') {
                    res.send('ok');
                } else {
                    res.send('error');
                }
            });
    });

    app.get('/radio/info', function (req, res) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // allow self signed certificate
        request(root + 'info')
            .then(function(response) {
                var resObj = JSON.parse(response);

                log.info('info: ', resObj);

                // TODO succes should be with double s
                if(resObj.status && resObj.status === 'succes') {
                    res.send(resObj.message);
                } else {
                    res.send('error');
                }
            });
    });
}

module.exports = {
    bind: bind
};