/* action types */

export const LOG_INFO = 'LOG_INFO';
export const LOG_ERROR = 'LOG_ERROR';
export const HIDE_SHORT_MESSAGE = 'HIDE_SHORT_MESSAGE';
export const CLEAR_LOG = 'CLEAR_LOG';
export const SET_MOVE_PARAMS = 'SET_MOVE_PARAMS';
export const SET_MOVE_PROGRESS = 'SET_MOVE_PROGRESS';
export const SET_FILEMANAGER_SOCKET = 'SET_FILEMANAGER_SOCKET';
export const SET_DIR_INDEX = 'SET_DIR_INDEX';
export const LIST_DIR = 'LIST_DIR';

/* util */

const writeLog = (...messages: any) => {
    const time = new Date();
    const timestamp = time.toTimeString().substring(0, 8);
    return `${timestamp} ${messages.join(' ')}`;
};

/* action creators */

// shortMessage and showShortMessage are used for SnackBar

export function logInfo(...messages: any) {
    return {
        type: LOG_INFO,
        message: writeLog('INFO: ', ...messages),
        shortMessage: messages.join(' '),
        showShortMessage: true
    };
}

export function logError(...messages: any) {
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

export const setMoveParams = (
    targetLocations: any,
    filePath: any,
    fileName: any
) => {
    return {
        type: SET_MOVE_PARAMS,
        targetLocations,
        filePath,
        fileName
    };
};

// Example of thunk with param
// export const showFtpStatus2 = (status, dirIndex) => {
//     return {
//         type: 'SHOW_FTP_STATUS_2',
//         status,
//         dirIndex
//     }
// }

export const setMoveProgress = (
    percentage: any,
    filePath: any,
    fileName: any
) => {
    return {
        type: SET_MOVE_PROGRESS,
        percentage,
        filePath,
        fileName
    };
};

export const setFileManagerSocket = (socket: any) => {
    return {
        type: SET_FILEMANAGER_SOCKET,
        socket
    };
};

export const setFileManagerDirIndex = (dirName: any, dirIndex: any) => {
    return {
        type: SET_DIR_INDEX,
        dirName,
        dirIndex
    };
};

export const fileManagerListDir = (dirName: any) => {
    return {
        type: LIST_DIR,
        dirName
    };
};

export * from './switchesList';
export * from './toggleExpandScene';
