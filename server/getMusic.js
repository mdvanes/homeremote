#!/usr/bin/env node
/* eslint-env node */

const youtubedl = require('youtube-dl');
const fsp = require('fs-promise');
const settings = require('../settings.json');

const bind = app => {

    app.post('/getMusic/info', function (req, res) {
        console.log('Call to http://%s:%s/getMusic/info');

        // url, options, callback
        youtubedl.getInfo(req.body.url, null, (err, info) => {
            if(info && info.title && !err) {
                console.log('title:', info.title);
                // Most of the time, info.title will be of the format %artist% - %title%
                const [artist, title] = info.title.split(' - ');

                res.send({status: 'ok', artist, title});
            } else {
                res.send({status: 'error'});
            }
        });
    });

    app.post('/getMusic/music', function (req, res) {
        console.log('Call to http://%s:%s/getMusic/music');

        console.log(`Trying getMusic <${req.body.url}, ${req.body.title}>`);
        res.send({status: 'ok'});


        var video = youtubedl('http://www.youtube.com/watch?v=90AiXO1pAiA',
          // Optional arguments passed to youtube-dl.
          ['--format=18'],
          // Additional options can be given for calling `child_process.execFile()`.
          { cwd: __dirname });

        // Will be called when the download starts.
        //video.on('info', function(info) {
        //  console.log('Download started');
        //  console.log('filename: ' + info.filename);
        //  console.log('size: ' + info.size);
        //});

        video.on('complete', function complete(info) {
            console.log('filename: ' + info._filename + ' already downloaded.');
        });

        video.on('end', function() {
            console.log('finished downloading!');

            // TODO change metadata: https://www.npmjs.com/package/id3-writer
        });

        video.on('error', function error(err) {
            console.log('error 2:', err);
        });

        // TODO retrieve path from settings.json
        // TODO set file name to artist - title
        video.pipe(fsp.createWriteStream('myvideo.mp4'));
    });

};

module.exports = { bind };