import { connect } from 'react-redux';
import { logInfo, logError, setMoveProgress, setFileManagerSocket, setFileManagerDirIndex } from '../actions';
import FileManager from '../components/fm';

// TODO listdir should be in Redux store and updated after a "move" action
// TODO Upgrade React to v16, Fix production build/minification/stage js/min.js
// TODO Upgrade Node, but before adding features check if it can deploy on server
// TODO connectEnsureLogin for web socket (test security)
// TODO also move progress for fmsmall
// Release 1.2.0
// TODO allow multiple (parallel, consecutive) moves without overwriting the state of existing move
// TODO cancel move button
// TODO replace copy by move, see https://github.com/sindresorhus/cp-file and https://github.com/sindresorhus/move-file/blob/master/index.js
// TODO do ws progress for ftp upload (if promise-ftp api supports it)

/* eslint-disable complexity */
function constructWsOrigin() {
    // TODO remove debug url
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const portSuffix = window.location.port === '' ? '' : `:${window.location.port}`;
    return window.location.hostname === 'localhost' ?
        'ws://localhost:3000' :
        `${protocol}//${window.location.hostname}${portSuffix}`;
}
/* eslint-enable complexity */

function listDir(oldDirName, newDirName) {
    return function(dispatch) {
        // Create the target dirname by suffixing it to the currently selected dir
        let dirName = newDirName;
        if(oldDirName && oldDirName.length > 0 &&
            newDirName && newDirName.length > 0) {
            dirName = oldDirName + '/' + newDirName;
        }
        return fetch('/fm/list/', {
            credentials: 'same-origin',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                path: dirName
            })
        })
            .then(data => data.json())
            .then(data => {
                // this.setState({
                //     dirName: data.dir
                // });
                dispatch(setFileManagerDirIndex(data.dir, data.list));
            })
            .catch(error => dispatch(logError('error on fm/list/path: ' + error)));
    }
}

function setupSocket() {
    return function(dispatch, getState) {
        const socket = new WebSocket(`${constructWsOrigin()}/fm/mvToTargetLocationProgress`);
        socket.onopen = () => socket.send(JSON.stringify({type: 'init'}));

        const wsMessageTypeHandlers = {
            //'move-progress': data => console.log('move-progress', Math.round(data.percentage * 100) + '%')
            'move-progress': data => dispatch(setMoveProgress(data.percentage, data.filePath, data.fileName)),
            'move-done': data => {
                dispatch(listDir(null, getState().fileManager.dirName));
                dispatch(logInfo(`Move of ${data.fileName} completed`));
            },
            'move-failed': data => dispatch(logError(`Move of ${data.fileName} failed`))
        };

        socket.onmessage = function(message) {
            //console.log('Socket server message', message);
            const data = JSON.parse(message.data);
            if(wsMessageTypeHandlers.hasOwnProperty(data.type)) {
                wsMessageTypeHandlers[data.type](data);
            }
        };

        dispatch(setFileManagerSocket(socket));
    };
}

// This is a simple thunk
function getFtpStatus(/*dirIndex*/) {
    return function(dispatch) {
        return fetch('/fm/ftpstatus', {
            credentials: 'same-origin',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        .then(data => data.json())
        .then(data => {
            dispatch(logInfo(`FTP status: ${data.ftpStatus}`));
            //dispatch(showFtpStatus2(data.ftpStatus, dirIndex));
        })
        .catch(error => dispatch(logError('error on fm/ftpstatus: ' + error)));
    }
}

const mapStateToProps = state => {
    return {
        moveProgress: state.moveProgress,
        dirIndex: state.fileManager.dirIndex,
        dirName: state.fileManager.dirName
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        },
        getFtpStatus: dirIndex => dispatch(getFtpStatus(dirIndex)),
        setupSocket: () => dispatch(setupSocket()),
        //setFileManagerDirIndex: dirIndex => dispatch(setFileManagerDirIndex(dirIndex))
        listDir: (oldDirName, newDirName) => dispatch(listDir(oldDirName, newDirName))
    };
};

const FileManagerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileManager);

export default FileManagerContainer;