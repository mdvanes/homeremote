import { Action, ActionCreator } from 'redux';

export const LOG_INFO = 'LOG_INFO';
export const LOG_ERROR = 'LOG_ERROR';
export const HIDE_SHORT_MESSAGE = 'HIDE_SHORT_MESSAGE';
export const CLEAR_LOG = 'CLEAR_LOG';

/* util */

const writeLog = (...messages: string[]): string => {
    const time = new Date();
    const timestamp = time.toTimeString().substring(0, 8);
    return `${timestamp} ${messages.join(' ')}`;
};

/* action creators */

interface LogAction extends Action<string> {
    message: string;
    shortMessage: string;
    showShortMessage: boolean;
}

export interface LogInfoAction extends LogAction {
    type: typeof LOG_INFO;
}

export interface LogErrorAction extends LogAction {
    type: typeof LOG_ERROR;
}

// shortMessage and showShortMessage are used for SnackBar

export const logInfo: ActionCreator<LogInfoAction> = (
    ...messages: string[]
) => ({
    type: LOG_INFO,
    message: writeLog('INFO: ', ...messages),
    shortMessage: messages.join(' '),
    showShortMessage: true
});

export const logError: ActionCreator<LogErrorAction> = (
    ...messages: string[]
) => ({
    type: LOG_ERROR,
    message: writeLog('ERROR:', ...messages),
    shortMessage: messages.join(' '),
    showShortMessage: true
});

// shortMessage and showShortMessage are used for SnackBar

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
