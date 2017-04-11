import { LOG_INFO, LOG_ERROR, HIDE_SHORT_MESSAGE, CLEAR_LOG } from '../actions/actions'; // eslint-disable-line no-unused-vars
import { combineReducers } from 'redux';

const loglines = (state = [], action) => {
    // Too keep cyclomatic complexity low
    const newLogState = [
        ...state,
        {
            message: action.message
        }
    ];
    const actionTypeMap = {
        LOG_ERROR: newLogState,
        LOG_INFO: newLogState,
        CLEAR_LOG: []
    };
    if(actionTypeMap.hasOwnProperty(action.type)) {
        return actionTypeMap[action.type];
    }
    return state;
    // switch (action.type) {
    //     case LOG_ERROR:
    //     case LOG_INFO:
    //         return [
    //             ...state,
    //             {
    //                 message: action.message
    //             }
    //         ];
    //     case CLEAR_LOG:
    //         return [];
    //     default:
    //         return state;
    // }
};

const short = (state = { shortMessage: '', showShortMessage: false }, action) => {
    const newLogState = {
        shortMessage: action.shortMessage,
        showShortMessage: action.showShortMessage
    };
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

const logApp = combineReducers({
    loglines,
    short
});

export default logApp;