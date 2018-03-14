import { SET_MOVE_PROGRESS } from '../actions/index';

const moveProgress = (state = { percentage: 0, filePath: '', fileName: '' }, action) => {
    if(action.type === SET_MOVE_PROGRESS) {
        return {
            percentage: action.percentage,
            filePath: action.filePath,
            fileName: action.fileName
        };
    }
    return state;
};

export default moveProgress;