import { SET_FILEMANAGER_SOCKET } from '../actions/index';

const fileManager = (state = { socket: null }, action) => {
    if(action.type === SET_FILEMANAGER_SOCKET) {
        return {
            socket: action.socket
        };
    }
    return state;
};

export default fileManager;