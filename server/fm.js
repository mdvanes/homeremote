#!/usr/bin/env node
/* eslint-env node */

const fs = require('fs-extra');
const cpFile = require('cp-file');
const settings = require('../settings.json');
const rootPath = settings.fm.rootPath;
const PromiseFtp = require('promise-ftp');
const prettyBytes = require('pretty-bytes');
const connectEnsureLogin = require('connect-ensure-login').ensureLoggedIn;
// TODO requires node 8.5 -> const { performance } = require('perf_hooks');

const fileToFileInfo = subPath => {
    return file => {
        return fs.stat(rootPath + '/' + subPath + '/' + file)
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
    fs.readdir(location.path)
        .then(files => {
            if(!files) {
                throw new Error(`Possibly invalid path: ${location.path}`);
            }
            const actions = files.map(file => {
                //console.log('setting permission for ', location.path + '/' + file);
                // 775 octal for rwxrwxr-x / 666 octal for rwrwrw
                return fs.chmod(location.path + '/' + file, '666');
            });
            const results = Promise.all(actions);
            return results;
        });
};

const createMoveProgressMessage = (msg, percentage) => {
    return JSON.stringify({
        type: 'move-progress',
        percentage: percentage,
        filePath: msg.sourcePath,
        fileName: msg.fileName
    });
};

const moveFile = (ws, msg, log) => {
    let lastWsSend = null;
    // TODO secure agains path traversal
    const sourcePath = rootPath + '/' + msg.sourcePath + '/' + msg.fileName;
    const targetNewFile = msg.targetPath + '/' + msg.fileName;
    fs.exists(sourcePath)
        .then(result => {
            if(result) {
                return fs.exists(msg.targetPath);
            } else {
                throw new Error('sourcePath does not exist: ' + sourcePath);
            }
        })
        .then(result => {
            if(result) {
                // Send initial progress to initialize progress bar
                ws.send(createMoveProgressMessage(msg, 0.0001));
                // cpy does support "progress" reporting https://github.com/sindresorhus/cpy#progress-reporting, but sibling util https://github.com/sindresorhus/move-file does not
                return cpFile(sourcePath, targetNewFile)
                    .on('progress', data => {
                        // NOTE nothing is being rendered if too many updates are sent
                        const now = Date.now(); //performance.now();
                        // Throttle to max one update per 500ms
                        if(lastWsSend && (now - lastWsSend) >= 500) {
                            // emit to websocket here, only to initiating client to preserve resources? or all clients?
                            ws.send(createMoveProgressMessage(msg, data.percent));
                        }
                        lastWsSend = now;
                    });
            } else {
                throw new Error('targetPath does not exist: ' + msg.targetPath);
            }
        })
        .then(() => {
            // Delete the source file after success
            if(fs.lstatSync(sourcePath).isFile()) {
                return fs.remove(sourcePath);
            } else {
                throw new Error(`can not delete sourcePath if directory ${sourcePath}`)
            }
        })
        .then(() => {
            // Done, so send "100%" progress
            ws.send(createMoveProgressMessage(msg, 1));
            // Done, so mark as done
            ws.send(JSON.stringify({
                type: 'move-done',
                filePath: msg.sourcePath,
                fileName: msg.fileName
            }))
        })
        .catch(err => {
            log.error('ERROR mvToTargetLocation:', err);
            ws.send(JSON.stringify({
                type: 'move-failed',
                filePath: msg.sourcePath,
                fileName: msg.fileName
            }))
        });
};

const bind = function(app, expressWs, log) {

    app.post('/fm/list', connectEnsureLogin(), function (req, res) {
        log.info('Call to /fm/list');

        log.info(`Trying path <${req.body.path}>`);
        const subPath = req.body.path;

        if(!rootPath) {
            res.send({status: 'error: invalid rootPath'});
            return;
        }

        fs.readdir(rootPath + '/' + subPath)
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
                log.error(error);
                res.send({status: 'error'});
            });
    });

    app.post('/fm/rename', connectEnsureLogin(), (req, res) => {
        log.info('Call to /fm/rename');

        const src = rootPath + '/' + req.body.path + '/' + req.body.src;
        const target = rootPath + '/' + req.body.path + '/' + req.body.target;
        fs.move(src, target, {overwrite: true})
            .then(() => res.sendStatus(205)) // 205, reset content
            .catch(error => {
                log.error('/fm/rename', error);
                res.sendStatus(500);
            });

    });

    app.get('/fm/getTargetLocations', connectEnsureLogin(), (req, res) => {
        const targetLocations = settings.fm.targetLocations.map(location => {
            return location.path;
        });
        res.send({status: 'ok', targetLocations});
    });

    app.get('/fm/resetFilePermissions', connectEnsureLogin(), (req, res) => {
        const actions = settings.fm.targetLocations.map(resetPermissionsForDirContent);
        Promise.all(actions)
            .then(() => {
                res.send({status: 'ok'});
            })
            .catch(error => {
                log.error(error);
                res.send({status: 'error'});
            });
    });

    const progressEndpoint = '/fm/mvToTargetLocationProgress';
    //app.ws(progressEndpoint, () => {}); // (ws, req) => {}
    app.ws(progressEndpoint, (ws/*, req*/) => {
        ws.on('message', msg => {
            const parsedMsg = JSON.parse(msg);
            console.log('received', parsedMsg, parsedMsg.type);
            if(parsedMsg.type === 'startMove') {
                moveFile(ws, parsedMsg, log);
            }
        })
    }); // (ws, req) => {}

    // app.post('/fm/mvToTargetLocation', connectEnsureLogin(), (req, res) => {
    //     const sourcePath = rootPath + '/' + req.body.sourcePath + '/' + req.body.fileName;
    //     const targetNewFile = req.body.targetPath + '/' + req.body.fileName;
    //     fsp.exists(sourcePath)
    //         .then(result => {
    //             if(result) {
    //                 return fsp.exists(req.body.targetPath);
    //             } else {
    //                 throw new Error('sourcePath does not exist: ' + sourcePath);
    //             }
    //         })
    //         .then(result => {
    //             if(result) {
    //                 // fsp.move does not support "progress" reporting
    //                 return fsp.move(sourcePath, targetNewFile);
    //             } else {
    //                 throw new Error('targetPath does not exist: ' + req.body.targetPath);
    //             }
    //         })
    //         .then(() => {
    //             res.send({status: 'ok'});
    //         })
    //         .catch(err => {
    //             log.error('ERROR mvToTargetLocation:', err);
    //             res.send({status: 'error'});
    //         });
    // });

    let ftpStatus = 'nothing started';

    app.get('/fm/ftpstatus', connectEnsureLogin(), (req, res) => {
        res.send({status: 'ok', ftpStatus});
    });

    app.post('/fm/ftp', connectEnsureLogin(), (req, res) => {
        const path = rootPath + '/' + req.body.path;
        ftpStatus = `Starting upload of ${path} to ${settings.ftp.remotePath}`;
        log.info(`FTP will try to send ${path} to ${settings.ftp.remotePath}`);

        const ftp = new PromiseFtp();
        ftp.connect({
            host: settings.ftp.host,
            user: settings.ftp.user,
            password: settings.ftp.password,
            secure: false})
            .then(serverMessage => {
                log.info('Server message: ' + serverMessage);
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
                log.info('src', path, 'target', remoteTargetPath);
                return ftp.put(path, remoteTargetPath);
            })
            .then(() => {
                ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} succeeded`;
                log.info(ftpStatus);
                return ftp.end();
            })
            .catch(error => {
                log.error('error:', error);
                ftpStatus = `Upload of ${path} to ${settings.ftp.remotePath} failed: ${error}`;
                return ftp.end();
            });

        res.send({status: 'ok'});
    });
};

module.exports = { bind };