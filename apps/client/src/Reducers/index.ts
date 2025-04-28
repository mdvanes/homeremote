import { combineReducers } from "redux";
import appStatusReducer from "../Components/Molecules/AppStatusButton/appStatusSlice";
import loglinesReducer from "../Components/Molecules/LogCard/logSlice";
import switchBarListReducer from "../Components/Molecules/SwitchBarList/switchBarListSlice";
import urlToMusicReducer from "../Components/Molecules/UrlToMusic/urlToMusicSlice";
import authenticationReducer from "../Components/Providers/Authentication/authenticationSlice";
import { activeConnectionsApi } from "../Services/activeConnectionsApi";
import { carTwinApi } from "../Services/carTwinApi";
import { dataloraApi } from "../Services/dataloraApi";
import { dockerListApi } from "../Services/dockerListApi";
import { downloadListApi } from "../Services/downloadListApi";
import { emptyApi } from "../Services/emptyApi";
import { emptyApiWithRetry } from "../Services/emptyApiWithRetry";
import { homesecApi } from "../Services/homesecApi";
import { jukeboxApi } from "../Services/jukeboxApi";
import { monitApi } from "../Services/monitApi";
import { nextupApi } from "../Services/nextupApi";
import { nowplayingApi } from "../Services/nowplayingApi";
import { scheduleApi } from "../Services/scheduleApi";
import { serviceLinksApi } from "../Services/serviceLinksApi";
import { stacksApi } from "../Services/stacksApi";
import { urlToMusicApi } from "../Services/urlToMusicApi";

const rootReducer = combineReducers({
    appStatus: appStatusReducer,
    authentication: authenticationReducer,
    loglines: loglinesReducer,
    switchesList: switchBarListReducer,
    urlToMusic: urlToMusicReducer,
    [activeConnectionsApi.reducerPath]: activeConnectionsApi.reducer,
    [carTwinApi.reducerPath]: carTwinApi.reducer,
    [dataloraApi.reducerPath]: dataloraApi.reducer,
    [dockerListApi.reducerPath]: dockerListApi.reducer,
    [downloadListApi.reducerPath]: downloadListApi.reducer,
    [homesecApi.reducerPath]: homesecApi.reducer,
    [jukeboxApi.reducerPath]: jukeboxApi.reducer,
    [monitApi.reducerPath]: monitApi.reducer,
    [nextupApi.reducerPath]: nextupApi.reducer,
    [nowplayingApi.reducerPath]: nowplayingApi.reducer,
    [scheduleApi.reducerPath]: scheduleApi.reducer,
    [serviceLinksApi.reducerPath]: serviceLinksApi.reducer,
    [stacksApi.reducerPath]: stacksApi.reducer,
    [urlToMusicApi.reducerPath]: urlToMusicApi.reducer,
    [emptyApi.reducerPath]: emptyApi.reducer,
    [emptyApiWithRetry.reducerPath]: emptyApiWithRetry.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
