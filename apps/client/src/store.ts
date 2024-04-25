import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import rootReducer from "./Reducers";
import { activeConnectionsApi } from "./Services/activeConnectionsApi";
import { carTwinApi } from "./Services/carTwinApi";
import { dataloraApi } from "./Services/dataloraApi";
import { dockerListApi } from "./Services/dockerListApi";
import { downloadListApi } from "./Services/downloadListApi";
import { energyUsageApi } from "./Services/energyUsageApi";
import { homesecApi } from "./Services/homesecApi";
import { jukeboxApi } from "./Services/jukeboxApi";
import { monitApi } from "./Services/monitApi";
import { nextupApi } from "./Services/nextupApi";
import { nowplayingApi } from "./Services/nowplayingApi";
import { scheduleApi } from "./Services/scheduleApi";
import { serviceLinksApi } from "./Services/serviceLinksApi";
import { stacksApi } from "./Services/stacksApi";
import { urlToMusicApi } from "./Services/urlToMusicApi";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            activeConnectionsApi.middleware,
            carTwinApi.middleware,
            dataloraApi.middleware,
            dockerListApi.middleware,
            downloadListApi.middleware,
            energyUsageApi.middleware,
            homesecApi.middleware,
            jukeboxApi.middleware,
            monitApi.middleware,
            nextupApi.middleware,
            nowplayingApi.middleware,
            scheduleApi.middleware,
            serviceLinksApi.middleware,
            stacksApi.middleware,
            urlToMusicApi.middleware
        ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
