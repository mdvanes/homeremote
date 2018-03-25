import { LOG_INFO, LOG_ERROR, HIDE_SHORT_MESSAGE } from '../actions/index'; // eslint-disable-line no-unused-vars

const short = (state = { shortMessage: '', showShortMessage: false }, action) => {
    const newLogState = {
        shortMessage: action.shortMessage,
        showShortMessage: action.showShortMessage
    };
    // TODO this accidentally works: e.g. the imported LOG_INFO is not used as a key, a new key shadowing this value is created
    const actionTypeMap = {
        LOG_ERROR: newLogState,
        LOG_INFO: newLogState,
        HIDE_SHORT_MESSAGE: newLogState
    };
    if(actionTypeMap.hasOwnProperty(action.type)) {
        return actionTypeMap[action.type];
    }
    return state;
};

export default short;