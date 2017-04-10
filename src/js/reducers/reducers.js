import { LOG_INFO, LOG_ERROR, HIDE_SHORT_MESSAGE, CLEAR_LOG } from '../actions/actions';
import { combineReducers } from 'redux';

// TODO to ES6 function
function loglines(state = [], action) {
    switch (action.type) {
        case LOG_ERROR:
        case LOG_INFO:
            return [
                ...state,
                {
                    message: action.message
                }
            ];
        case CLEAR_LOG:
            return [];
        default:
            return state;
    }
}

const short = (state = { shortMessage: '', showShortMessage: false }, action) => {
    switch(action.type) {
        case LOG_ERROR:
        case LOG_INFO:
        case HIDE_SHORT_MESSAGE:
            return {
                shortMessage: action.shortMessage,
                showShortMessage: action.showShortMessage
            };
        default:
            return state;
    }
};

// export default function logApp(state = {}, action) {
//     return {
//         log: logReducer(state.log, action)
//     };
// }

const logApp = combineReducers({
    loglines,
    short
});

export default logApp;