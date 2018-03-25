import { SET_FILEMANAGER_SOCKET, SET_DIR_INDEX, LIST_DIR } from '../actions/index';

const fileManager = (state = {
    socket: null,
    dirIndex: [{name: 'No files yet'}],
    dirName: ''
}, action) => {
    if(action.type === SET_FILEMANAGER_SOCKET) {
        return Object.assign({}, state, {
            socket: action.socket
        });
    } else if(action.type === SET_DIR_INDEX) {
        return Object.assign({}, state, {
            dirName: action.dirName,
            dirIndex: action.dirIndex
        });
    } else if(action.type === LIST_DIR) {
        return Object.assign({}, state, {
            dirName: action.dirName
        });
    }
    return state;
};

export default fileManager;