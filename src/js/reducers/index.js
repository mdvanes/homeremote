import loglines from './loglines';
import short from './short';
import moveParams from './moveParams';
import moveProgress from './moveProgress';
import { combineReducers } from 'redux';

const homeRemoteReducers = combineReducers({
    loglines,
    short,
    moveParams,
    moveProgress
});

export default homeRemoteReducers;