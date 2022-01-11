import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import rootReducer from "./Reducers";
import { downloadListApi } from "./Services/downloadListApi";
import { activeConnectionsApi } from "./Services/activeConnectionsApi";
import { dataloraApi } from "./Services/dataloraApi";

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            downloadListApi.middleware,
            activeConnectionsApi.middleware,
            dataloraApi.middleware
        ),
});

setupListeners(store.dispatch);

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
