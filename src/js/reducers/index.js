import loglines from './loglines';
import short from './short';
import moveParams from './moveParams';
import { combineReducers } from 'redux';

const homeRemoteReducers = combineReducers({
    loglines,
    short,
    moveParams
});

export default homeRemoteReducers;