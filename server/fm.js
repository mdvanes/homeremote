/* jshint node:true */
'use strict';

const fs = require('fs'); // TODO replace all by fs-promise
const fsp = require('fs-promise');
const settings = require('../settings.json');
const rootPath = settings.fm.rootPath;
const PromiseFtp = require('promise-ftp');
const prettyBytes = require('pretty-bytes');

var bind = function(app) {

    app.post('/fm/list', function (req, res) {
        console.log('call to http://%s:%s/fm/list/sub');

        console.log('Trying path', req.body.path);
        const subPath = req.body.path;

        if(!rootPath) {
            res.send({status: 'error: invalid rootPath'});
            return;
        }

        fs.readdir(rootPath + '/' + subPath, (err, files) => {
            //console.log(files);
            if(!files) {
                console.log('ERROR Possibly invalid path: ', rootPath + '/' + subPath);
                res.send({status: 'error'});
            } else {
                let filesStats = files.map(file => {
                    const stats = fs.statSync(rootPath + '/' + subPath + '/' + file);
                    //console.log(file, prettyBytes(stats.size));
                    return {
                        name: file,
                        isDir: stats.isDirectory(),
                        size: prettyBytes(stats.size)
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
            }
        });
    });

    app.post('/fm/rename', (req, res) => {
        console.log('call to http://%s:%s/fm/rename');
        //console.log(req.body.path, req.body.src, req.body.target);

        const src = rootPath + '/' + req.body.path + '/' + req.body.src;
        const target = rootPath + '/' + req.body.path + '/' + req.body.target;
        fsp.move(src, target, {overwrite: true})
            .then(() => res.sendStatus(205)) // 205, reset content
            .catch(error => {
                console.log('/fm/rename', error);
                res.sendStatus(500);
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
        ftpStatus = `Starting upload of ${path} to ${settings.ftp.remotePath}`;
        console.log(`FTP will try to send ${path} to ${settings.ftp.remotePath}`);
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

        const ftp = new PromiseFtp();
        ftp.connect({
            host: settings.ftp.host,
            user: settings.ftp.user,
            password: settings.ftp.password,
            secure: false})
        .then(serverMessage => {
            console.log('Server message: ' + serverMessage);
        })
        // .then(() => {
        //     return ftp.list(settings.ftp.remotePath);
        // })
        // .then(list => {
        //     console.dir(list);
        // })
        .then(() => {
            // Getting 550 Read-Only if not first cwd to target dir
            return ftp.cwd(settings.ftp.remotePath);
        })
        // .then(() => {
        //     return ftp.status();
        // })
        // .then(status => {
        //     console.log('ftpstatus', status);
        //     return;
        // })
        .then(() => {
            const fileNameArr = path.split('/'); // TODO path and filename should be passed as separate POST params
            const fileName = fileNameArr[fileNameArr.length - 1];
            const remoteTargetPath = settings.ftp.remotePath + '/' + fileName;
            console.log('src', path, 'target', remoteTargetPath);
            return ftp.put(path, remoteTargetPath);
        })
        .then(() => {
            ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} succeeded`;
            console.log(ftpStatus);
            return ftp.end();
        })
        .catch(error => {
            console.log('error:', error);
            ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} failed: ${error}`;
            return ftp.end();
        });

        // const ftp = new JSFtp({
        //     host: settings.ftp.host,
        //     user: settings.ftp.user,
        //     pass: settings.ftp.password,
        //     debugMode: true
        // });

        // ftp.put('.eslintrc', settings.ftp.remotePath + '/test2.txt', function(err) {
        //     if (!err) {
        //         console.log('File transferred successfully!');

        //         ftp.list(settings.ftp.remotePath, function(err, res) {
        //             console.log('res', res);
        //         });

        //     } else {
        //         console.log('Error on FTP put:', err);                
        //     }
        // });

        // ftp.auth(settings.ftp.user, settings.ftp.password, function(res) {
        //     console.log('Auth response:', res);

        //     ftp.put('README.md', settings.ftp.remotePath + '/test2.txt', function(err) {
        //         if (!err) {
        //             console.log('File transferred successfully!');

        //             ftp.list(settings.ftp.remotePath, function(err, res) {
        //                 console.log('res', res);
        //             });

        //         } else {
        //             console.log('Error on FTP put:', err);                
        //         }
        //     });
        // });

        //ftp.list(settings.ftp.remotePath, function(err, res) {
        //    console.log('res', res);
        //    /*res.forEach(function(file) {
        //        console.log('Listing file:', file.name);
        //    });*/
        //});

        res.send({status: 'ok'});
    });
};

module.exports = { bind };