import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
// import short from './short';
// import moveParams from './moveParams';
// import moveProgress from './moveProgress';
// import fileManager from './fileManager';
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    loglines: loglinesReducer,
    appStatus: appStatusReducer,
    switchesList: switchBarListReducer,
    // short,
    // moveParams,
    // moveProgress,
    // fileManager,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
