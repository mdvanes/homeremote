#!/usr/bin/env node
/* eslint-env node */

const fsp = require('fs-promise');
const youtubedl = require('youtube-dl');
const settings = require('../settings.json');
const id3 = require('id3-writer');
const writer = new id3.Writer();

// TODO note: ffmpeg/ffprobe is required as an OS dependency
// TODO also eyeD3: sudo apt-get install eyed3

// const fsp = require('fs-promise');
// const downloadPromise = (url, artist, title) => {
//     return new Promise((resolve, reject) => {
//         const video = youtubedl(url,
//           // Optional arguments passed to youtube-dl.
//           //['--format=best']
//           // Does not work, see https://github.com/przemyslawpluta/node-youtube-dl/issues/117 or use youtubedl.exec directly ['--extract-audio', '--audio-format=mp3', '--audio-quality=0']
//           // Works, but produces webm container with mp3 extension
//           ['--format=bestaudio', '--audio-format=mp3', '--audio-quality=0']
//           );


//         let fileName = `${encodeURIComponent(url)}.mp3`;
//         if(artist && artist.length > 0 && title && title.length > 0) {
//             fileName = `${artist} - ${title}.mp3`;
//         }
//         const targetPath = `${settings.musicpath}/${fileName}`;

//         video.on('complete', function complete(info) {
//             console.log('filename: ' + info._filename + ' already downloaded.');
//         });

//         video.on('end', function() {
//             console.log('finished downloading!');
//             resolve({path: targetPath, fileName});
//         });

//         video.on('error', function error(err) {
//             reject('error 2:' + err);
//             console.log('error 2:', err);
//         });

//         video.pipe(fsp.createWriteStream(targetPath));
//     });
// };

const downloadPromise = (url, artist, title) => {
    return new Promise((resolve, reject) => {
        let fileName = encodeURIComponent(url);
        if(artist && artist.length > 0 && title && title.length > 0) {
            fileName = `${artist} - ${title}`;
        }
        let targetPath = `${settings.musicpath}/${fileName}`;
        // First send to mp4, mp3 is created with --extract-audio
        const options = ['-o', targetPath + '.mp4', '--extract-audio', '--audio-format', 'mp3', '--audio-quality', '0'];
        // Extension is needed for setting metadata
        targetPath += '.mp3';
        fileName += '.mp3';
        youtubedl.exec(url, options, (err, output) => {
            if(err) {
                reject('youtubedl.exec failed:' + err);
            } else {
                console.log('youtubedl.exec finished:', output);
                resolve({path: targetPath, fileName});
            }
        });
    });
};

const setMetadataPromise = (path, fileName, artist, title, album) => {
    return new Promise((resolve, reject) => {
        if(artist && artist.length > 0 && title && title.length > 0) {
            const file = new id3.File(path);
            const meta = new id3.Meta({ artist, title, album });

            writer.setFile(file).write(meta, function(err) {
                if (err) {
                    reject('set metadata failed: ' + err);
                } else {
                    console.log('id3 finished');
                    resolve({path, fileName});
                }
            });
        }
    });
};

const bind = app => {

    app.post('/getMusic/info', function (req, res) {
        console.log('Call to http://%s:%s/getMusic/info');

        // url, options, callback
        youtubedl.getInfo(req.body.url, null, (err, info) => {
            if(info && info.title && !err) {
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

        let fileName = '';
        let path = '';
        downloadPromise(req.body.url, req.body.artist, req.body.title)
        .then(data => {
            path = data.path;
            fileName = data.fileName;
            return setMetadataPromise(data.path, data.fileName, req.body.artist, req.body.title, req.body.album);
        })
        // 775 octal for rwxrwxr-x / 664 octal for rwrwr-
        .then(data => fsp.chmod(data.path, '664'))
        .then(() => fsp.chown(path, settings.ownerinfo.uid, settings.ownerinfo.gid))
        .then(() => res.send({status: 'ok', fileName}))
        .catch(err => {
            console.log(err);
            res.send({status: 'error'});
        });
    });

};

module.exports = { bind };