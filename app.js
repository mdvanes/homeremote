/**
 * Created by m.van.es on 6-7-2015.
 */
/* jshint node:true */
'use strict';

var express = require('express');
var app = express();

/* start: broadcast module */
app.get('/broadcast/start', function (req, res) {
    console.log('call to http://%s:%s/broadcast/start');
    res.send('ok');
});

app.get('/broadcast/stop', function (req, res) {
    res.send('broadcast stop');
});

app.get('/broadcast/status', function (req, res) {
    console.log('call to http://%s:%s/broadcast/status');
    res.send('stopped');
});
/* end: broadcast module */

app.use(express.static('public'));

var server = app.listen(3000, function () {

    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);

});
