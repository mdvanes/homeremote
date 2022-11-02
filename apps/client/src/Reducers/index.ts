import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import authenticationReducer from "../Components/Providers/Authentication/authenticationSlice";
import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import urlToMusicReducer from "../Components/Molecules/UrlToMusic/urlToMusicSlice";
import { dataloraApi } from "../Services/dataloraApi";
import { dockerListApi } from "../Services/dockerListApi";
import { downloadListApi } from "../Services/downloadListApi";
import { activeConnectionsApi } from "../Services/activeConnectionsApi";
import { combineReducers } from "redux";
import { serviceLinksApi } from "../Services/serviceLinksApi";
import { jukeboxApi } from "../Services/jukeboxApi";
import { urlToMusicApi } from "../Services/urlToMusicApi";
import { monitApi } from "../Services/monitApi";

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
    [serviceLinksApi.reducerPath]: serviceLinksApi.reducer,
    [urlToMusicApi.reducerPath]: urlToMusicApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
