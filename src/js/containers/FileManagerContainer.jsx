import { connect } from 'react-redux';
import { logInfo, logError, setMoveProgress } from '../actions';
import FileManager from '../components/fm';

// TODO web socket back-end code in app.js
// TODO initial connect to web socket
// TODO connectEnsureLogin for web socket
// TODO start/end move can be with normal thunk, no web socket
// TODO replace copy by move, see https://github.com/sindresorhus/cp-file and https://github.com/sindresorhus/move-file/blob/master/index.js

function constructWsOrigin() {
    // TODO remove debug url
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const portSuffix = window.location.port === '' ? '' : `:${window.location.port}`;
    return window.location.hostname === 'localhost' ?
        'ws://localhost:3000' :
        `${protocol}//${window.location.hostname}${portSuffix}`;
}

function setupSocket() {
    return function(dispatch) {
        const socket = new WebSocket(`${constructWsOrigin()}/echo`);
        socket.onopen = () => socket.send(JSON.stringify({type: 'init'}));

        const wsMessageTypeHandlers = {
            //'move-progress': data => console.log('move-progress', Math.round(data.percentage * 100) + '%')
            //'move-progress': data => dispatch(setMoveProgress(socket, data.percentage, data.filePath, data.fileName))
            'move-progress': data => dispatch(setMoveProgress(data.percentage, data.filePath, data.fileName))
        };

        socket.onmessage = function(message) {
            console.log('Socket server message', message);
            const data = JSON.parse(message.data);
            if(wsMessageTypeHandlers.hasOwnProperty(data.type)) {
                wsMessageTypeHandlers[data.type](data);
            }
        };
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
        moveProgress: state.moveProgress
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
        setupSocket: () => dispatch(setupSocket())
    };
};

const FileManagerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileManager);

export default FileManagerContainer;