import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import authenticationReducer from "../authenticationSlice";

import { combineReducers } from "redux";

const rootReducer = combineReducers({
    loglines: loglinesReducer,
    appStatus: appStatusReducer,
    switchesList: switchBarListReducer,
    authentication: authenticationReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
