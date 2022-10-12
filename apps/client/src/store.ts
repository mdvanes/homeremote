import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import rootReducer from "./Reducers";
import { activeConnectionsApi } from "./Services/activeConnectionsApi";
import { dataloraApi } from "./Services/dataloraApi";
import { dockerListApi } from "./Services/dockerListApi";
import { downloadListApi } from "./Services/downloadListApi";
import { serviceLinksApi } from "./Services/serviceLinksApi";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            activeConnectionsApi.middleware,
            dataloraApi.middleware,
            dockerListApi.middleware,
            downloadListApi.middleware,
            serviceLinksApi.middleware
        ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
