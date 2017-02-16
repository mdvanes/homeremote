/* jshint node:true */
'use strict';

const fs = require('fs');
const fsp = require('fs-promise');
const settings = require('../settings.json');
const rootPath = settings.fm.rootPath;
const PromiseFtp = require('promise-ftp');

var bind = function(app) {
    app.get('/fm/list', function (req, res) {
        console.log('call to http://%s:%s/fm/list');

        if(!rootPath) {
            res.send({status: 'error: invalid rootPath'});
            return;
        }

        fs.readdir(rootPath, (err, files) => {
            let filesStats = files.map(file => {
                //console.log(file);
                // fs.stat('/home/martin/ZNoBackup/homeremote/' + file, (errz, stats) => {
                //     console.log(file, stats.isDirectory());
                //     return {
                //         name: file,
                //         isDir: stats.isDirectory()
                //     };
                // });
                // TODO solve this with async version of fs.stat
                const stats = fs.statSync(rootPath + '/' + file);
                return {
                    name: file,
                    isDir: stats.isDirectory()
                };
            });

            let filesStatsOnlyDirs = [];
            const filesStatsOnlyFiles = filesStats.filter(file => {
                if(file.isDir) {
                    filesStatsOnlyDirs.push(file);
                }
                return !file.isDir;
            });
            filesStats = filesStatsOnlyDirs.concat(filesStatsOnlyFiles);

            res.send({status: 'ok', list: filesStats});
        });

        //res.send({status: 'started'});
    });

    app.get('/fm/list/:path', function (req, res) {
        console.log('call to http://%s:%s/fm/list/sub');

        console.log('Trying path', req.params.path);
        const subPath = req.params.path;

        if(!rootPath) {
            res.send({status: 'error: invalid rootPath'});
            return;
        }

        // TODO merge with /fm/list
        fs.readdir(rootPath + '/' + subPath, (err, files) => {
            //console.log(files);
            let filesStats = files.map(file => {
                const stats = fs.statSync(rootPath + '/' + subPath + '/' + file);
                return {
                    name: file,
                    isDir: stats.isDirectory()
                };
            });

            let filesStatsOnlyDirs = [];
            const filesStatsOnlyFiles = filesStats.filter(file => {
                if(file.isDir) {
                    filesStatsOnlyDirs.push(file);
                }
                return !file.isDir;
            });
            filesStats = filesStatsOnlyDirs.concat(filesStatsOnlyFiles);

            // TODO fix JSON response: res.setHeader('Content-Type', 'application/json');
            res.send({status: 'ok', list: filesStats, dir: subPath});
        });
    });

    app.get('/fm/getTargetLocations', (req, res) => {
        const targetLocations = settings.fm.targetLocations.map(location => {
            return location.path;
        });
        res.send({status: 'ok', targetLocations});
    });

    app.get('/fm/mvToTargetLocation', (req, res) => {
        console.log('exists fsp?', fsp, req.body.sourcePath, req.body.targetPath);
        //fsp.move(req.body.sourcePath1, req.body.targetPath1)
        //    .then()
        //    .catch();
        //
        // fs.move('/tmp/somefile', '/tmp/does/not/exist/yet/somefile', function (err) {
        // if (err) return console.error(err)
        //     console.log("success!")
        // })
    });

    let ftpStatus = 'nothing started';

    app.get('/fm/ftpstatus', (req, res) => {
        res.send({status: 'ok', ftpStatus});
    });

    app.get('/fm/ftp/:path', (req, res) => {
        const path = rootPath + '/' + decodeURIComponent(req.params.path);
        console.log('FTP will try to send', path, 'to', settings.ftp.host, settings.ftp.user);
        // var ftp = new PromiseFtp();
        // ftp.connect({
        //     host: settings.ftp.host,
        //     user: settings.ftp.user,
        //     password: settings.ftp.password,
        //     secure: false})
        // .then(function (serverMessage) {
        //     console.log('Server message: ' + serverMessage);
        //     return ftp.list(settings.ftp.remotePath);
        // })
        // .then(function (list) {
        //     console.log('Directory listing:');
        //     console.dir(list);
        //     return ftp.end();
        // });

        ftpStatus = `Starting upload of ${path} to ${settings.ftp.remotePath}`;

        const ftp = new PromiseFtp();
        ftp.connect({
            host: settings.ftp.host,
            user: settings.ftp.user,
            password: settings.ftp.password,
            secure: false})
        .then(serverMessage => {
            console.log('Server message: ' + serverMessage);
        })
        .then(() => {
            return ftp.list(settings.ftp.remotePath);
        })
        .then(list => {
            console.dir(list);
            const remoteTargetPath = settings.ftp.remotePath + '/a.jpg';
            console.log('src', path, 'target', remoteTargetPath);
            return ftp.put(path, remoteTargetPath);
        })
        .then(() => {
            ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} succeeded`;
            return ftp.end();
        })
        .catch(error => {
            console.log('error:', error);
            ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} failed: ${error}`;
        });
        res.send({status: 'ok'});
    });
};

module.exports = { bind };