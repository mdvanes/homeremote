/* action types */

export const LOG_INFO = 'LOG_INFO';
export const LOG_ERROR = 'LOG_ERROR';
export const CLEAR_LOG = 'CLEAR_LOG';

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

export function clearLog() {
    return {
        type: CLEAR_LOG
    };
}
