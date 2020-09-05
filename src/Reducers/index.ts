import loglines from "./loglines";
import loglinesNew from "../Components/Molecules/Log/logSlice";
// import short from './short';
// import moveParams from './moveParams';
// import moveProgress from './moveProgress';
// import fileManager from './fileManager';
// import switchesList from "./switchesList";
// import expandedScenes from "./expandedScenes";
import switchesList from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    loglines,
    // short,
    // moveParams,
    // moveProgress,
    // fileManager,
    switchesList,
    // expandedScenes,
    loglinesNew,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
