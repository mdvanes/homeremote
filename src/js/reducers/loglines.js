import { LOG_INFO, LOG_ERROR, CLEAR_LOG } from '../actions/index'; // eslint-disable-line no-unused-vars

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

export default loglines;
