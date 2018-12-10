import loglines from './loglines';
import short from './short';
import moveParams from './moveParams';
import moveProgress from './moveProgress';
import fileManager from './fileManager';
import switchesList from './switchesList';
import { combineReducers } from 'redux';

const homeRemoteReducers = combineReducers({
    loglines,
    short,
    moveParams,
    moveProgress,
    fileManager,
    switchesList
});

export default homeRemoteReducers;