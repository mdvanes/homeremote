#!/usr/bin/env node
/* eslint-env node */

const http = require('http');
const Transmission = require('transmission');
const settings = require('../settings.json');

const httpGetPromise = url => {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            const statusCode = res.statusCode;
            const contentType = res.headers['content-type'];

            let error;
            if (statusCode !== 200) {
                error = new Error(`Request Failed.\n
                    Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error(`Invalid content-type.\n
                    Expected application/json but received ${contentType}`);
            }
            if (error) {
                console.log(error.message);
                // consume response data to free up memory
                res.resume();
                return;
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => rawData += chunk);
            res.on('end', () => {
                try {
                    let parsedData = JSON.parse(rawData);
                    //console.log(parsedData); // TODO
                    //res1.send({status: 'ok'});
                    resolve(parsedData);
                } catch (e) {
                    console.log(e.message);
                    reject('zzz failed:' + e.message); // TODO reject
                }
            });
        }).on('error', (e) => {
            console.log(`Got error: ${e.message}`); // TODO reject
        });
    });
};

const transmissionPromise = transmission => {
    return new Promise((resolve, reject) => {
        //console.log('transmission.status', transmission.status, settings.gears.tr.host);
        // If first param [ids] is omitted, get all. See https://www.npmjs.com/package/transmission
        transmission.get((err, arg) => {
            if(err) {
                reject('transmissionPromise failed:' + err.message);
            }
            //console.log('trans entries:', arg, 'err:', err);
            //console.log('trans entries:', arg.torrents.length, 'err:', err);
            //console.log('trans test:', arg.torrents[1]);
            // for(let id in arg.torrents) {
            //     let entry = arg.torrents[id];
            //     //console.log('trans entry', entry.name, entry.haveValid, entry.totalSize);
            //     if(entry.totalSize > 0) {
            //         let percentage = Math.round((entry.haveValid / entry.totalSize) * 100);
            //         console.log('trans entry', entry.name, percentage + '%');
            //     } else {
            //         console.log('trans entry', entry.name, 'getting metadata');
            //     }
            // }
            const result = arg.torrents.map(entry => {
                let percentage = 0;
                let status = 'getting metadata';
                if(entry.totalSize > 0) {
                    percentage = Math.round((entry.haveValid / entry.totalSize) * 100);
                    //console.log('trans entry', entry.name, percentage + '%');
                    status = '';
                }
                return {
                    type: 'tr',
                    name: entry.name,
                    percentage,
                    status
                };
            });
            resolve(result);
        });
        //transmission.sessionStats(function(err, result){
        //    if(err){
        //        console.log(err);
        //    } else {
        //        console.log(result);
        //    }
        //});
    });
};

const bind = app => {
    // api?mode=queue&output=json&apikey=3
    //
    // queue.slots[0].filename
    // queue.slots[0].percentage

    // api?mode=history&output=json&apikey=3
    //
    // history.slots[0].name
    // history.slots[0].status

    app.get('/gears/info', function (req, res) {
        console.log('Call to http://%s:%s/gears/info');

        const sbQueueUri = `${settings.gears.sn.uri}sabnzbd/api?mode=queue&output=json&apikey=${settings.gears.sn.apikey}`;
        console.log(sbQueueUri);

        httpGetPromise(sbQueueUri)
        .then(data => console.log('data.queue.slots.length', data.queue.slots.length))
        .catch(err => {
            console.log(err);
            res.send({status: 'error'});
        });

        const sbHistoryUri = `${settings.gears.sn.uri}sabnzbd/api?mode=history&output=json&apikey=${settings.gears.sn.apikey}`;
        httpGetPromise(sbHistoryUri)
        .then(data => console.log('history.slots[0]', data.history.slots[0].name, data.history.slots[0].status))
        .catch(err => {
            console.log(err);
            res.send({status: 'error'});
        });

        const transmission = new Transmission({
            host: settings.gears.tr.host,
            port: settings.gears.tr.port,
            username: settings.gears.tr.user,
            password: settings.gears.tr.password
        });
        transmissionPromise(transmission)
        .then(data => {
            res.send({status: 'ok', list: data});
        })
        .catch(err => {
            console.log(err);
            res.send({status: 'error'});
        });

        // Combine all calls with Promise.all(iterable);
    });
};

module.exports = { bind };