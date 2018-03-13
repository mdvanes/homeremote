import { connect } from 'react-redux';
import { logInfo, logError } from '../actions';
import FileManager from '../components/fm';

// const socket = new WebSocket('ws://localhost:8081'); // TODO what is the correct URL??
// socket.onopen = () => socket.send(JSON.stringify({type: 'init'}));
//
// const wsMessageTypeHandlers = {
//     'move-progress': data => console.log('move-progress', (data.percentage * 100) + '%')
//     //'move-progress': () => dispatch(foo(socket))
// };
//
// socket.onmessage = function(message) {
//     console.log('Socket server message', message);
//     const data = JSON.parse(message.data);
//     if(wsMessageTypeHandlers.hasOwnProperty(data.type)) {
//         wsMessageTypeHandlers[data.type](data);
//     }
// };

// This is a simple thunk
function getFtpStatus(/*dirIndex*/) {
    return function (dispatch) {
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

const mapStateToProps = () => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        logInfo: (...messages) => {
            dispatch(logInfo(...messages));
        },
        logError: (...messages) => {
            dispatch(logError(...messages));
        },
        getFtpStatus: dirIndex => dispatch(getFtpStatus(dirIndex))
    };
};

const FileManagerContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(FileManager);

export default FileManagerContainer;