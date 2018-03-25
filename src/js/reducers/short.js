import { LOG_INFO, LOG_ERROR, HIDE_SHORT_MESSAGE } from '../actions/index';

const short = (state = { shortMessage: '', showShortMessage: false }, action) => {
    const newLogState = {
        shortMessage: action.shortMessage,
        showShortMessage: action.showShortMessage
    };
    const actionTypeMap = {
        [LOG_ERROR]: newLogState,
        [LOG_INFO]: newLogState,
        [HIDE_SHORT_MESSAGE]: newLogState
    };
    if(actionTypeMap.hasOwnProperty(action.type)) {
        return actionTypeMap[action.type];
    }
    return state;
};

export default short;