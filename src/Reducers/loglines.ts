import {
    LOG_INFO,
    LOG_ERROR,
    CLEAR_LOG,
    LogInfoAction,
    LogErrorAction,
} from "../Actions";

type Logline = {
    message: string;
};

type State = Logline[];

// TODO this should be the union of all possible Actions in the application
type Actions = LogInfoAction | LogErrorAction;

// TODO use type State from LogContainer
type LoglinesReducer = (state: State, action: Actions) => State;

const loglines: LoglinesReducer = (state = [], action) => {
    // Too keep cyclomatic complexity low
    const newLogState: State = [
        ...state,
        {
            message: action.message,
        },
    ];
    const actionTypeMap: Record<string, State> = {
        [LOG_ERROR]: newLogState,
        [LOG_INFO]: newLogState,
        [CLEAR_LOG]: [],
    };
    if (actionTypeMap.hasOwnProperty(action.type)) {
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
