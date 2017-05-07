import { SET_MOVE_PARAMS } from '../actions/index';

const moveParams = (state = { targetLocations: [], fileName: '' }, action) => {
    if(action.type === SET_MOVE_PARAMS) {
        return {
            targetLocations: action.targetLocations,
            fileName: action.fileName
        };
    }
    return state;
};

export default moveParams;