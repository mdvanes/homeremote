import { combineReducers } from "redux";
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import urlToMusicReducer from "../Components/Molecules/UrlToMusic/urlToMusicSlice";
import authenticationReducer from "../Components/Providers/Authentication/authenticationSlice";
import { activeConnectionsApi } from "../Services/activeConnectionsApi";
import { dataloraApi } from "../Services/dataloraApi";
import { dockerListApi } from "../Services/dockerListApi";
import { downloadListApi } from "../Services/downloadListApi";
import { jukeboxApi } from "../Services/jukeboxApi";
import { monitApi } from "../Services/monitApi";
import { scheduleApi } from "../Services/scheduleApi";
import { serviceLinksApi } from "../Services/serviceLinksApi";
import { urlToMusicApi } from "../Services/urlToMusicApi";

const rootReducer = combineReducers({
    appStatus: appStatusReducer,
    authentication: authenticationReducer,
    loglines: loglinesReducer,
    switchesList: switchBarListReducer,
    urlToMusic: urlToMusicReducer,
    [activeConnectionsApi.reducerPath]: activeConnectionsApi.reducer,
    [dataloraApi.reducerPath]: dataloraApi.reducer,
    [dockerListApi.reducerPath]: dockerListApi.reducer,
    [downloadListApi.reducerPath]: downloadListApi.reducer,
    [jukeboxApi.reducerPath]: jukeboxApi.reducer,
    [monitApi.reducerPath]: monitApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [serviceLinksApi.reducerPath]: serviceLinksApi.reducer,
    [urlToMusicApi.reducerPath]: urlToMusicApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
