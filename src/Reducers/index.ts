import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import authenticationReducer from "../Components/Providers/Authentication/authenticationSlice";
import urlToMusicReducer from "../Components/Molecules/UrlToMusic/urlToMusicSlice";
import downloadListReducer from "../Components/Molecules/DownloadList/downloadListSlice";
import { downloadListApi } from "../Services/downloadListApi";
import { activeConnectionsApi } from "../Services/activeConnectionsApi";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    loglines: loglinesReducer,
    appStatus: appStatusReducer,
    switchesList: switchBarListReducer,
    authentication: authenticationReducer,
    urlToMusic: urlToMusicReducer,
    downloadList: downloadListReducer,
    [downloadListApi.reducerPath]: downloadListApi.reducer,
    [activeConnectionsApi.reducerPath]: activeConnectionsApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
