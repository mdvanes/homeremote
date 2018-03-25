import { SET_FILEMANAGER_SOCKET, SET_DIR_INDEX, LIST_DIR } from '../actions/index';

const fileManager = (state = {
    socket: null,
    dirIndex: [{name: 'No files yet'}],
    dirName: ''
}, action) => {
    const actionTypeMap = {
        [SET_FILEMANAGER_SOCKET]: Object.assign({}, state, {
            socket: action.socket
        }),
        [SET_DIR_INDEX]: Object.assign({}, state, {
            dirName: action.dirName,
            dirIndex: action.dirIndex
        }),
        [LIST_DIR]: Object.assign({}, state, {
            dirName: action.dirName
        })
    };
    if(actionTypeMap.hasOwnProperty(action.type)) {
        return actionTypeMap[action.type];
    }
    return state;
};

export default fileManager;