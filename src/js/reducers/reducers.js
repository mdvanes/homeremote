import { ADD_LOGLINE, CLEAR_LOG } from '../actions/actions';
import { combineReducers } from 'redux';

function loglines(state = [], action) {
    switch (action.type) {
        case ADD_LOGLINE:
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

// export default function logApp(state = {}, action) {
//     return {
//         log: logReducer(state.log, action)
//     };
// }

// TODO skip combineReducers?
const logApp = combineReducers({
    loglines
});

export default logApp;