import loglines from './loglines';
import short from './short';
import moveParams from './moveParams';
import moveProgress from './moveProgress';
import fileManager from './fileManager';
import { combineReducers } from 'redux';

const homeRemoteReducers = combineReducers({
    loglines,
    short,
    moveParams,
    moveProgress,
    fileManager
});

export default homeRemoteReducers;