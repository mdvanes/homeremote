import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import authenticationReducer from "../Components/Providers/Authentication/authenticationSlice";
import urlToMusicReducer from "../Components/Molecules/UrlToMusic/urlToMusicSlice";
import { dataloraApi } from "../Services/dataloraApi";
import { dockerListApi } from "../Services/dockerListApi";
import { downloadListApi } from "../Services/downloadListApi";
import { activeConnectionsApi } from "../Services/activeConnectionsApi";
import { combineReducers } from "redux";
import { serviceLinksApi } from "../Services/serviceLinksApi";
import { jukeboxApi } from "../Services/jukeboxApi";

const rootReducer = combineReducers({
    loglines: loglinesReducer,
    appStatus: appStatusReducer,
    switchesList: switchBarListReducer,
    authentication: authenticationReducer,
    urlToMusic: urlToMusicReducer,
    [activeConnectionsApi.reducerPath]: activeConnectionsApi.reducer,
    [dataloraApi.reducerPath]: dataloraApi.reducer,
    [dockerListApi.reducerPath]: dockerListApi.reducer,
    [downloadListApi.reducerPath]: downloadListApi.reducer,
    [jukeboxApi.reducerPath]: jukeboxApi.reducer,
    [serviceLinksApi.reducerPath]: serviceLinksApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
