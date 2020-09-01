import loglines from './loglines';
// import short from './short';
// import moveParams from './moveParams';
// import moveProgress from './moveProgress';
// import fileManager from './fileManager';
import switchesList from './switchesList';
import expandedScenes from './expandedScenes';
import switchesListNew from '../Components/Molecules/SwitchBarList/switchBarListSlice';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
    loglines,
    // short,
    // moveParams,
    // moveProgress,
    // fileManager,
    switchesList,
    expandedScenes,
    switchesListNew
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
