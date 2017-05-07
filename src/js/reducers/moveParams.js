import { SET_MOVE_PARAMS } from '../actions/index';

const moveParams = (state = { targetLocations: [], filePath: '', fileName: '' }, action) => {
    if(action.type === SET_MOVE_PARAMS) {
        return {
            targetLocations: action.targetLocations,
            filePath: action.filePath,
            fileName: action.fileName
        };
    }
    return state;
};

export default moveParams;