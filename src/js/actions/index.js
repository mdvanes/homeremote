/* action types */

export const LOG_INFO = 'LOG_INFO';
export const LOG_ERROR = 'LOG_ERROR';
export const HIDE_SHORT_MESSAGE = 'HIDE_SHORT_MESSAGE';
export const CLEAR_LOG = 'CLEAR_LOG';
export const SET_MOVE_PARAMS = 'SET_MOVE_PARAMS';

/* util */

const writeLog = (...messages) => {
    let time = new Date();
    let timestamp = time.toTimeString().substring(0,8);
    return `${timestamp} ${messages.join(' ')}`;
};

/* action creators */

// shortMessage and showShortMessage are used for SnackBar

export function logInfo(...messages) {
    return {
        type: LOG_INFO,
        message: writeLog('INFO: ', ...messages),
        shortMessage: messages.join(' '),
        showShortMessage: true
    };
}

export function logError(...messages) {
    return {
        type: LOG_ERROR,
        message: writeLog('ERROR:', ...messages),
        shortMessage: messages.join(' '),
        showShortMessage: true
    };
}

export function hideShortMessage() {
    return {
        type: HIDE_SHORT_MESSAGE,
        shortMessage: '',
        showShortMessage: false
    };
}

export const clearLog = () => {
    return {
        type: CLEAR_LOG
    };
};

export const setMoveParams = (targetLocations, fileName) => {
    return {
        type: SET_MOVE_PARAMS,
        targetLocations,
        fileName
    };
};