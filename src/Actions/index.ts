/* action types */

export const SET_MOVE_PARAMS = "SET_MOVE_PARAMS";
export const SET_MOVE_PROGRESS = "SET_MOVE_PROGRESS";
export const SET_FILEMANAGER_SOCKET = "SET_FILEMANAGER_SOCKET";
export const SET_DIR_INDEX = "SET_DIR_INDEX";
export const LIST_DIR = "LIST_DIR";

/* action creators */

export const setMoveParams = (
    targetLocations: any,
    filePath: any,
    fileName: any
) => {
    return {
        type: SET_MOVE_PARAMS,
        targetLocations,
        filePath,
        fileName,
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
        fileName,
    };
};

export const setFileManagerSocket = (socket: any) => {
    return {
        type: SET_FILEMANAGER_SOCKET,
        socket,
    };
};

export const setFileManagerDirIndex = (dirName: any, dirIndex: any) => {
    return {
        type: SET_DIR_INDEX,
        dirName,
        dirIndex,
    };
};

export const fileManagerListDir = (dirName: any) => {
    return {
        type: LIST_DIR,
        dirName,
    };
};
