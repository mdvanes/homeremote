#!/usr/bin/env node
/* eslint-env node */

const fsp = require('fs-promise');
const settings = require('../settings.json');
const rootPath = settings.fm.rootPath;
const PromiseFtp = require('promise-ftp');
const prettyBytes = require('pretty-bytes');

const fileToFileInfo = subPath => {
    return file => {
        return fsp.stat(rootPath + '/' + subPath + '/' + file)
            .then(stat => {
                return {
                    name: file,
                    isDir: stat.isDirectory(),
                    size: prettyBytes(stat.size)
                };
            });
    };
};

const resetPermissionsForDirContent = location => {
    console.log('Resetting file permissions for dir', location.path);

    // Only set permissions for the files in this dir, not the dir itself
    // Using chmodr(p), this had the side effect that dir itself was unreadable, but the contens were correct
    fsp.readdir(location.path)
        .then(files => {
            if(!files) {
                throw new Error(`Possibly invalid path: ${location.path}`);
            }
            const actions = files.map(file => {
                //console.log('setting permission for ', location.path + '/' + file);
                // 775 octal for rwxrwxr-x / 666 octal for rwrwrw
                return fsp.chmod(location.path + '/' + file, '666');
            });
            const results = Promise.all(actions);
            return results;
        });
};

var bind = function(app) {

    app.post('/fm/list', function (req, res) {
        console.log('call to http://%s:%s/fm/list/sub');

        console.log(`Trying path <${req.body.path}>`);
        const subPath = req.body.path;

        if(!rootPath) {
            res.send({status: 'error: invalid rootPath'});
            return;
        }

        fsp.readdir(rootPath + '/' + subPath)
            .then(files => {
                if(!files) {
                    throw new Error(`Possibly invalid path: ${rootPath}/${subPath}`);
                }
                const actions = files.map(fileToFileInfo(subPath));
                const results = Promise.all(actions);
                return results;
            })
            .then(fileInfos => {
                const fileInfosOnlyDirs = [];
                const fileInfosOnlyFiles = fileInfos.filter(file => {
                    if(file.isDir) {
                        fileInfosOnlyDirs.push(file);
                    }
                    return !file.isDir;
                });
                fileInfos = fileInfosOnlyDirs.concat(fileInfosOnlyFiles);

                // TODO fix JSON response: res.setHeader('Content-Type', 'application/json');
                res.send({status: 'ok', list: fileInfos, dir: subPath});
            })
            .catch(error => {
                console.log(error);
                res.send({status: 'error'});
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

    app.get('/fm/resetFilePermissions', (req, res) => {
        const actions = settings.fm.targetLocations.map(resetPermissionsForDirContent);
        Promise.all(actions)
            .then(() => {
                res.send({status: 'ok'});
            })
            .catch(error => {
                console.log(error);
                res.send({status: 'error'});
            });
    });

    app.post('/fm/mvToTargetLocation', (req, res) => {
        const sourcePath = rootPath + '/' + req.body.sourcePath + '/' + req.body.fileName;
        const targetNewFile = req.body.targetPath + '/' + req.body.fileName;
        fsp.exists(sourcePath)
            .then(result => {
                if(result) {
                    return fsp.exists(req.body.targetPath);
                } else {
                    throw new Error('sourcePath does not exist: ' + sourcePath);
                }
            })
            .then(result => {
                if(result) {
                    return fsp.move(sourcePath, targetNewFile);
                } else {
                    throw new Error('targetPath does not exist: ' + req.body.targetPath);
                }
            })
            .then(() => {
                res.send({status: 'ok'});
            })
            .catch(err => {
                console.log('ERROR mvToTargetLocation:', err);
                res.send({status: 'error'});
            });
    });

    let ftpStatus = 'nothing started';

    app.get('/fm/ftpstatus', (req, res) => {
        res.send({status: 'ok', ftpStatus});
    });

    app.post('/fm/ftp', (req, res) => {
        const path = rootPath + '/' + req.body.path;
        ftpStatus = `Starting upload of ${path} to ${settings.ftp.remotePath}`;
        console.log(`FTP will try to send ${path} to ${settings.ftp.remotePath}`);

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

        res.send({status: 'ok'});
    });
};

module.exports = { bind };